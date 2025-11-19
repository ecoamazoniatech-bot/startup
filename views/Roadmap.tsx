import React, { useState } from 'react';
import type { UseStartupDataReturn, RoadmapTask } from '../types';

interface RoadmapProps {
  data: UseStartupDataReturn;
}

const TaskCard: React.FC<{ task: RoadmapTask; columnId: string; onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, sourceColId: string) => void }> = ({ task, columnId, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id, columnId)}
      className="bg-white p-3 mb-3 rounded-lg shadow cursor-grab active:cursor-grabbing"
    >
      {task.content}
    </div>
  );
};

const RoadmapColumn: React.FC<{
  title: string;
  columnId: string;
  tasks: RoadmapTask[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, sourceColId: string) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetColId: string) => void;
}> = ({ title, columnId, tasks, onDragStart, onDrop }) => {
  return (
    <div
      className="bg-gray-100 p-4 rounded-lg w-full md:w-1/3"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, columnId)}
    >
      <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 border-primary">{title} ({tasks.length})</h3>
      <div>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} columnId={columnId} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
};


const Roadmap: React.FC<RoadmapProps> = ({ data }) => {
  const [roadmap, setRoadmap] = useState(data.roadmap);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string, sourceColId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColId', sourceColId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColId = e.dataTransfer.getData('sourceColId');

    if (sourceColId === targetColId) return;

    const newRoadmap = { ...roadmap };
    
    const sourceCol = newRoadmap[sourceColId as keyof typeof newRoadmap];
    const taskIndex = sourceCol.findIndex(t => t.id === taskId);
    const [movedTask] = sourceCol.splice(taskIndex, 1);

    const targetCol = newRoadmap[targetColId as keyof typeof newRoadmap];
    targetCol.push(movedTask);

    setRoadmap(newRoadmap);
    data.updateRoadmap(newRoadmap);
  };


  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Roadmap do Produto</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <RoadmapColumn title="A Fazer" columnId="todo" tasks={roadmap.todo} onDragStart={handleDragStart} onDrop={handleDrop} />
        <RoadmapColumn title="Em Progresso" columnId="inProgress" tasks={roadmap.inProgress} onDragStart={handleDragStart} onDrop={handleDrop} />
        <RoadmapColumn title="Concluído" columnId="done" tasks={roadmap.done} onDragStart={handleDragStart} onDrop={handleDrop} />
      </div>
    </div>
  );
};

export default Roadmap;

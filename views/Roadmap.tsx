
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
      className="bg-white p-4 mb-4 rounded-2xl shadow-sm border-2 border-transparent hover:border-primary cursor-grab active:cursor-grabbing group transition-all"
    >
      <p className="font-medium text-gray-800">{task.content}</p>
      <div className="flex justify-end mt-2">
          <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <span className="mr-1">⚡</span> {task.xpReward} XP
          </span>
      </div>
    </div>
  );
};

const RoadmapColumn: React.FC<{
  title: string;
  columnId: string;
  tasks: RoadmapTask[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, sourceColId: string) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetColId: string) => void;
  colorClass: string;
}> = ({ title, columnId, tasks, onDragStart, onDrop, colorClass }) => {
  return (
    <div
      className={`p-4 rounded-3xl w-full md:w-1/3 flex flex-col ${colorClass}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, columnId)}
    >
      <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="font-black text-lg text-gray-700">{title}</h3>
          <span className="bg-white/50 px-3 py-1 rounded-full text-sm font-bold text-gray-600">{tasks.length}</span>
      </div>
      <div className="flex-1 min-h-[200px]">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} columnId={columnId} onDragStart={onDragStart} />
        ))}
        {tasks.length === 0 && (
            <div className="h-full border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 text-sm font-medium italic p-4">
                Arraste quests para cá
            </div>
        )}
      </div>
    </div>
  );
};


const Roadmap: React.FC<RoadmapProps> = ({ data }) => {
  const [roadmap, setRoadmap] = useState(data.roadmap);
  const [showXpToast, setShowXpToast] = useState<{visible: boolean, amount: number} | null>(null);

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

    // Logic to award XP if moving to Done
    if (targetColId === 'done' && sourceColId !== 'done') {
        data.awardXP(data.currentUser.id, movedTask.xpReward);
        
        // Show celebration toast
        setShowXpToast({ visible: true, amount: movedTask.xpReward });
        setTimeout(() => setShowXpToast(null), 3000);
    }
  };


  return (
    <div className="relative h-full">
      {showXpToast && (
          <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 animate-[bounce_0.5s_infinite]">
              <div className="bg-yellow-400 text-white font-black text-2xl px-8 py-4 rounded-full shadow-2xl border-4 border-white flex items-center">
                  <span className="text-3xl mr-2">⚡</span>
                  Level Up! +{showXpToast.amount} XP
              </div>
          </div>
      )}
      
      <h1 className="text-3xl font-black text-dark mb-6">Quests (Roadmap)</h1>
      <div className="flex flex-col md:flex-row gap-6 h-full pb-10">
        <RoadmapColumn 
            title="A Fazer" 
            columnId="todo" 
            tasks={roadmap.todo} 
            onDragStart={handleDragStart} 
            onDrop={handleDrop} 
            colorClass="bg-gray-100"
        />
        <RoadmapColumn 
            title="Em Progresso" 
            columnId="inProgress" 
            tasks={roadmap.inProgress} 
            onDragStart={handleDragStart} 
            onDrop={handleDrop} 
            colorClass="bg-blue-50"
        />
        <RoadmapColumn 
            title="Concluído" 
            columnId="done" 
            tasks={roadmap.done} 
            onDragStart={handleDragStart} 
            onDrop={handleDrop} 
            colorClass="bg-green-50"
        />
      </div>
    </div>
  );
};

export default Roadmap;

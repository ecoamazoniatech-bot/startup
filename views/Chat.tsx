import React, { useState, useRef, useEffect } from 'react';
import type { UseStartupDataReturn, TeamMember } from '../types';

interface ChatProps {
    data: UseStartupDataReturn;
}

const Chat: React.FC<ChatProps> = ({ data }) => {
    const { currentUser, team, chatMessages, sendMessage } = data;
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(team.find(m => m.id !== currentUser.id) || null);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [chatMessages, selectedMember]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && selectedMember) {
            sendMessage({
                senderId: currentUser.id,
                receiverId: selectedMember.id,
                text: message,
            });
            setMessage('');
        }
    };
    
    const conversation = chatMessages.filter(
        msg => (msg.senderId === currentUser.id && msg.receiverId === selectedMember?.id) ||
               (msg.senderId === selectedMember?.id && msg.receiverId === currentUser.id)
    ).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return (
        <div className="flex h-[calc(100vh-150px)]">
            <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-dark">Conversas</h2>
                </div>
                <ul className="overflow-y-auto">
                    {team.filter(m => m.id !== currentUser.id).map(member => (
                        <li key={member.id}>
                            <button 
                                onClick={() => setSelectedMember(member)}
                                className={`w-full text-left p-4 flex items-center space-x-3 hover:bg-gray-100 ${selectedMember?.id === member.id ? 'bg-blue-50' : ''}`}
                            >
                                <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full" />
                                <div>
                                    <p className="font-semibold text-dark">{member.name}</p>
                                    <p className="text-sm text-medium">{member.role}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-2/3 flex flex-col">
                {selectedMember ? (
                    <>
                        <div className="p-4 bg-white border-b border-gray-200 flex items-center space-x-3">
                             <img src={selectedMember.avatar} alt={selectedMember.name} className="w-12 h-12 rounded-full" />
                             <div>
                                <h3 className="text-lg font-bold text-dark">{selectedMember.name}</h3>
                                <p className="text-sm text-secondary font-semibold">Online</p>
                             </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                            {conversation.map(msg => (
                                <div key={msg.id} className={`flex mb-4 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.senderId === currentUser.id ? 'bg-primary text-white' : 'bg-white shadow'}`}>
                                        <p>{msg.text}</p>
                                        <p className={`text-xs mt-1 text-right ${msg.senderId === currentUser.id ? 'text-blue-200' : 'text-gray-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 bg-white border-t">
                            <form onSubmit={handleSendMessage} className="flex space-x-3">
                                <input 
                                    type="text" 
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Digite sua mensagem..." 
                                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark">Enviar</button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <p>Selecione um membro da equipe para iniciar uma conversa.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;
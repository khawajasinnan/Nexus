import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { AvailabilitySlot } from '../../types';
import { AvailabilitySlotCard } from './AvailabilitySlotCard';
import { Button } from '../ui/Button';
import { useMeetings } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const AvailabilityManager: React.FC = () => {
    const { user } = useAuth();
    const { getUserSlots, addSlot, updateSlot, removeSlot } = useMeetings();
    const [showForm, setShowForm] = useState(false);
    const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
    const [formData, setFormData] = useState({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '10:00',
        isRecurring: true,
    });

    if (!user) return null;

    const slots = getUserSlots(user.id);

    // Group by day
    const slotsByDay = DAYS.reduce<Record<string, AvailabilitySlot[]>>((acc, day, index) => {
        const daySlots = slots.filter(s => s.dayOfWeek === index);
        if (daySlots.length > 0) acc[day] = daySlots;
        return acc;
    }, {});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSlot) {
            updateSlot(editingSlot.id, formData);
            setEditingSlot(null);
        } else {
            addSlot({ ...formData, userId: user.id });
        }
        setShowForm(false);
        setFormData({ dayOfWeek: 1, startTime: '09:00', endTime: '10:00', isRecurring: true });
    };

    const handleEdit = (slot: AvailabilitySlot) => {
        setEditingSlot(slot);
        setFormData({
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isRecurring: slot.isRecurring,
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingSlot(null);
        setFormData({ dayOfWeek: 1, startTime: '09:00', endTime: '10:00', isRecurring: true });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Clock size={18} className="text-secondary-600" />
                    <h3 className="text-sm font-semibold text-gray-900">My Availability</h3>
                </div>
                {!showForm && (
                    <Button size="xs" variant="secondary" onClick={() => setShowForm(true)} leftIcon={<Plus size={14} />}>
                        Add Slot
                    </Button>
                )}
            </div>

            {/* Add / Edit form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-secondary-50 border border-secondary-100 space-y-3 animate-slide-up">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Day of Week</label>
                        <select
                            value={formData.dayOfWeek}
                            onChange={e => setFormData(prev => ({ ...prev, dayOfWeek: parseInt(e.target.value) }))}
                            className="w-full rounded-lg border-gray-200 text-sm py-2 px-3 focus:ring-secondary-500 focus:border-secondary-500"
                        >
                            {DAYS.map((day, i) => (
                                <option key={i} value={i}>{day}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                className="w-full rounded-lg border-gray-200 text-sm py-2 px-3 focus:ring-secondary-500 focus:border-secondary-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">End Time</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                className="w-full rounded-lg border-gray-200 text-sm py-2 px-3 focus:ring-secondary-500 focus:border-secondary-500"
                                required
                            />
                        </div>
                    </div>

                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isRecurring}
                            onChange={e => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                            className="rounded border-gray-300 text-secondary-600 focus:ring-secondary-500"
                        />
                        <span className="text-xs text-gray-700">Repeat weekly</span>
                    </label>

                    <div className="flex items-center space-x-2 pt-1">
                        <Button type="submit" size="sm" variant="secondary" fullWidth>
                            {editingSlot ? 'Update Slot' : 'Add Slot'}
                        </Button>
                        <Button type="button" size="sm" variant="outline" fullWidth onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                </form>
            )}

            {/* Slots list */}
            {Object.keys(slotsByDay).length > 0 ? (
                <div className="space-y-3">
                    {Object.entries(slotsByDay).map(([, daySlots]) => (
                        <div key={daySlots[0]?.dayOfWeek} className="space-y-1.5">
                            {daySlots.map(slot => (
                                <AvailabilitySlotCard
                                    key={slot.id}
                                    slot={slot}
                                    onEdit={handleEdit}
                                    onDelete={removeSlot}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-2">
                        <Clock size={18} className="text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500">No availability slots yet</p>
                </div>
            )}
        </div>
    );
};

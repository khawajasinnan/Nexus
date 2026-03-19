import React from 'react';
import { Clock, Repeat, Edit2, Trash2 } from 'lucide-react';
import { AvailabilitySlot } from '../../types';
import { Badge } from '../ui/Badge';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface AvailabilitySlotCardProps {
    slot: AvailabilitySlot;
    onEdit: (slot: AvailabilitySlot) => void;
    onDelete: (slotId: string) => void;
}

export const AvailabilitySlotCard: React.FC<AvailabilitySlotCardProps> = ({
    slot,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="group flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white hover:border-secondary-200 hover:shadow-soft transition-all duration-200">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary-50 rounded-lg">
                    <Clock size={16} className="text-secondary-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-900">{DAYS[slot.dayOfWeek]}</p>
                    <p className="text-xs text-gray-500">
                        {slot.startTime} — {slot.endTime}
                    </p>
                </div>
                {slot.isRecurring && (
                    <Badge variant="secondary" className="text-xs">
                        <Repeat size={10} className="mr-1" />
                        Weekly
                    </Badge>
                )}
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(slot)}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-primary-600 transition-colors"
                    title="Edit slot"
                >
                    <Edit2 size={14} />
                </button>
                <button
                    onClick={() => onDelete(slot.id)}
                    className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete slot"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
};

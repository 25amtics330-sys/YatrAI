import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useDispatch } from 'react-redux';
import { reorderDays } from '@/store/plannerSlice';
import DayCard from './DayCard';
import { AlertCircle, CloudRain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ItineraryTimeline({ days, alerts = [] }) {
  const dispatch = useDispatch();

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    dispatch(
      reorderDays({
        sourceIndex: result.source.index,
        destinationIndex: result.destination.index,
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Global Alerts */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-2 mb-6"
          >
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-danger/10 border-l-4 border-danger p-4 rounded-r-card flex items-start gap-3 shake"
              >
                <AlertCircle className="text-danger shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-danger font-semibold text-sm">{alert.title}</h4>
                  <p className="text-danger/80 text-xs mt-1">{alert.message}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="timeline">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="relative before:absolute before:inset-0 before:ml-[28px] md:before:ml-[34px] before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border/50"
            >
              {days.map((day, index) => (
                <Draggable key={day.date} draggableId={day.date} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`relative pl-12 md:pl-16 py-4 transition-opacity ${
                        snapshot.isDragging ? 'opacity-90 z-50' : 'opacity-100 z-10'
                      }`}
                    >
                      {/* Timeline Node */}
                      <div
                        {...provided.dragHandleProps}
                        className="absolute left-[20px] md:left-[24px] top-6 w-5 h-5 rounded-full bg-surface border-2 border-primary flex items-center justify-center cursor-grab active:cursor-grabbing z-20 hover:scale-125 transition-transform"
                        title="Drag to reorder"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>

                      {/* Content */}
                      <DayCard day={day} index={index} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

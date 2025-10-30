import { type FC } from 'react';
import { Card, Button } from 'react-bootstrap';
import { type Reaction } from '../modules/type';
import './ReactionCard.css';

interface Props {
  reaction: Reaction;
  onCardClick: () => void;
  onAddToSynthesis: () => void;
}

export const ReactionCard: FC<Props> = ({ reaction, onCardClick, onAddToSynthesis }) => {
  return (
    <Card className="h-100">
      <Card.Img 
        variant="top" 
        src={reaction.Src || '/static/images/default-reaction.jpg'} 
        style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
        onClick={onCardClick}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="flex-grow-0" style={{ cursor: 'pointer' }} onClick={onCardClick}>
          {reaction.Title}
        </Card.Title>
        
        <div className="mb-2">
          <small className="text-muted">
            <strong>Исходное вещество:</strong> {reaction.StartingMaterial}
            
          </small>
        </div>
        
        <div className="mb-3">
          <small className="text-muted">
            <strong>Результат:</strong> {reaction.ResultMaterial}
          </small>
        </div>

        <div className="mt-auto">
          <div className="d-grid gap-2">
            <Button variant="outline-primary" onClick={onCardClick}>
              Подробнее
            </Button>
            <Button variant="primary" onClick={onAddToSynthesis}>
              Добавить в синтез
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
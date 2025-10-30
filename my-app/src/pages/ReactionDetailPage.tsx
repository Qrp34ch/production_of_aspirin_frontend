import { type FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { type Reaction } from '../modules/type';
import { REACTIONS_MOCK } from '../modules/mock';
import { getReaction } from '../modules/reactionsApi';
import { BreadCrumbs } from '../components/BreadCrumbs';
import defaultImage from "../assets/DefaultImage.jpg"
import './ReactionDetailPage.css';

export const ReactionDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReaction = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const reactionData = await getReaction(parseInt(id));
        setReaction(reactionData);
      } catch (error) {
        console.error('Ошибка загрузки реакции:', error);
        const mockReaction = REACTIONS_MOCK.find(r => r.ID === parseInt(id));
        setReaction(mockReaction || null);
      } finally {
        setLoading(false);
      }
    };

    fetchReaction();
  }, [id]);

  if (loading) {
    return (
      <div className="steppage">   
        <div> <p></p></div>
        <div> <p></p></div>
        <div> <p></p></div>
        <div> <p></p></div>
        <div> <p></p></div>
        <BreadCrumbs />   
        <div className="standartpage">
          <div className="step-details">
            <div className="frame-step">
              <p className="text-step-title"><span className="text-step-title">Загрузка...</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reaction) {
    return (
      <div className="steppage">
        <div> <p></p></div>
        <div> <p></p></div>
        <div> <p></p></div>
        <div> <p></p></div>
        <div> <p></p></div>
        <BreadCrumbs />
        <div className="standartpage">
          <div className="step-details">
            <div className="frame-step">
              <p className="text-step-title"><span className="text-step-title">Реакция не найдена</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="steppage">
      <div> <p></p></div>
      <div> <p></p></div>
      <div> <p></p></div>
      <div> <p></p></div>
      <div> <p></p></div>
      <BreadCrumbs />
      <div className="standartpage">
        <div className="step-details">
          <div className="frame-step">
            <p className="text-step-title"><span className="text-step-title">{reaction.Title}</span></p>
            <div className="frame-666">
              <div className="frame-png">
                <img src={reaction.Src || defaultImage} className="image" alt="img" />
              </div>
              <div className="frame-details">
                <div className="frame-text-details">
                  <p className="text-step-details"><span className="text-step-details">{reaction.Details}</span></p>
                </div>
                {reaction.SrcUr && (
                  <img src={reaction.SrcUr} className="formula" alt="formula" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
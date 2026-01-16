import { type FC, useEffect, useState, type ChangeEvent } from 'react';
import { 
  Container, 
  Button, 
  Modal, 
  Form, 
  Alert, 
  Spinner,
  Badge,
  Card,
  Col,
  Image
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { api } from '../api';
import { type Reaction } from '../modules/type';
import { getReactions } from '../modules/reactionsApi';
import './AdminReactionsPage.css';

export const AdminReactionsPage: FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Модальное окно
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [modalLoading, setModalLoading] = useState(false);
  
  // Данные для формы
  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    details: '',
    startingMaterial: '',
    densitySM: '',
    molarMassSM: '',
    resultMaterial: '',
    densityRM: '',
    molarMassRM: ''
  });

  // Состояния для загрузки изображений
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrFile, setImageUrFile] = useState<File | null>(null);
  const [imageUrPreview, setImageUrPreview] = useState<string | null>(null);
  const [currentReactionId, setCurrentReactionId] = useState<number | null>(null);
  const [currentReactionData, setCurrentReactionData] = useState<Reaction | null>(null);

  // Загрузка реакций
  const loadReactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReactions();
      setReactions(data || []);
    } catch (err) {
      console.error('Ошибка загрузки реакций:', err);
      setError('Не удалось загрузить список реакций');
      setReactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReactions();
  }, []);

  // Фильтрация реакций
  const filteredReactions = reactions.filter(reaction => 
    reaction.Title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reaction.StartingMaterial?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reaction.ResultMaterial?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Открытие модального окна для создания
  const handleCreate = () => {
    setFormData({
      id: 0,
      title: '',
      details: '',
      startingMaterial: '',
      densitySM: '',
      molarMassSM: '',
      resultMaterial: '',
      densityRM: '',
      molarMassRM: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setImageUrFile(null);
    setImageUrPreview(null);
    setCurrentReactionId(null);
    setCurrentReactionData(null);
    setModalMode('create');
    setShowModal(true);
  };

  // Открытие модального окна для редактирования
  const handleEdit = (reaction: Reaction) => {
    setFormData({
      id: reaction.ID || 0,
      title: reaction.Title || '',
      details: reaction.Details || '',
      startingMaterial: reaction.StartingMaterial || '',
      densitySM: reaction.DensitySM?.toString() || '',
      molarMassSM: reaction.MolarMassSM?.toString() || '',
      resultMaterial: reaction.ResultMaterial || '',
      densityRM: reaction.DensityRM?.toString() || '',
      molarMassRM: reaction.MolarMassRM?.toString() || ''
    });
    setImageFile(null);
    setImagePreview(null);
    setImageUrFile(null);
    setImageUrPreview(null);
    setCurrentReactionId(reaction.ID || null);
    setCurrentReactionData(reaction);
    setModalMode('edit');
    setShowModal(true);
  };

  // Удаление реакции
  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту реакцию?')) {
      return;
    }

    try {
      setModalLoading(true);
      await api.api.reactionDelete(id);
      
      // Обновляем список
      await loadReactions();
      
      alert('Реакция успешно удалена');
    } catch (err: any) {
      console.error('Ошибка удаления:', err);
      alert('Ошибка при удалении реакции: ' + (err.response?.data?.description || err.message));
    } finally {
      setModalLoading(false);
    }
  };

  // Загрузка изображения с указанием типа
  const uploadImageWithType = async (reactionId: number, file: File, imageType: 'main' | 'ur'): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', imageType); // Добавляем тип изображения

      // Передаем FormData вместо объекта
      await api.api.reactionImageCreate(reactionId, formData);
      
      console.log(`Изображение ${imageType} успешно загружено для реакции ${reactionId}`);
      return true;
    } catch (err: any) {
      console.error(`Ошибка загрузки изображения ${imageType}:`, err);
      alert(`Ошибка при загрузке изображения ${imageType}: ${err.response?.data?.description || err.message}`);
      return false;
    }
  };

  // Создание реакции с загрузкой изображений
  const createReactionWithImages = async (): Promise<void> => {
    const requestData = {
      title: formData.title,
      details: formData.details || undefined,
      starting_material: formData.startingMaterial,
      density_sm: formData.densitySM ? parseFloat(formData.densitySM) : undefined,
      molar_mass_sm: formData.molarMassSM ? parseFloat(formData.molarMassSM) : undefined,
      result_material: formData.resultMaterial,
      density_rm: formData.densityRM ? parseFloat(formData.densityRM) : undefined,
      molar_mass_rm: formData.molarMassRM ? parseFloat(formData.molarMassRM) : undefined,
      is_delete: false
    };

    try {
      // Создаем реакцию без изображений
      await api.api.createReactionCreate(requestData);
      
      // Получаем ID созданной реакции
      const allReactions = await getReactions();
      const latestReaction = allReactions[allReactions.length - 1];
      const newReactionId = latestReaction.ID;

      if (!newReactionId) {
        throw new Error('Не удалось получить ID созданной реакции');
      }

      // Загружаем основное изображение, если есть
      if (imageFile) {
        await uploadImageWithType(newReactionId, imageFile, 'main');
      }

      // Загружаем изображение UR, если есть
      if (imageUrFile) {
        await uploadImageWithType(newReactionId, imageUrFile, 'ur');
      }

    } catch (err: any) {
      console.error('Ошибка создания реакции:', err);
      throw err;
    }
  };

  // Редактирование реакции с загрузкой изображений
  const updateReactionWithImages = async (): Promise<void> => {
    const requestData = {
      title: formData.title,
      details: formData.details || undefined,
      starting_material: formData.startingMaterial,
      density_sm: formData.densitySM ? parseFloat(formData.densitySM) : undefined,
      molar_mass_sm: formData.molarMassSM ? parseFloat(formData.molarMassSM) : undefined,
      result_material: formData.resultMaterial,
      density_rm: formData.densityRM ? parseFloat(formData.densityRM) : undefined,
      molar_mass_rm: formData.molarMassRM ? parseFloat(formData.molarMassRM) : undefined,
      is_delete: false
    };

    try {
      // Обновляем реакцию без изображений
      await api.api.reactionUpdate(formData.id, requestData);

      // Загружаем новое основное изображение, если есть
      if (imageFile && currentReactionId) {
        await uploadImageWithType(currentReactionId, imageFile, 'main');
      }

      // Загружаем новое изображение UR, если есть
      if (imageUrFile && currentReactionId) {
        await uploadImageWithType(currentReactionId, imageUrFile, 'ur');
      }

    } catch (err: any) {
      console.error('Ошибка обновления реакции:', err);
      throw err;
    }
  };

  // Обработчик выбора файла
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, isUr: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите файл изображения');
        return;
      }

      // Проверка размера файла (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Размер файла не должен превышать 5MB');
        return;
      }

      if (isUr) {
        setImageUrFile(file);
        
        // Создание превью
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImageFile(file);
        
        // Создание превью
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Удаление выбранного файла
  const removeSelectedFile = (isUr: boolean = false) => {
    if (isUr) {
      setImageUrFile(null);
      setImageUrPreview(null);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  // Сохранение формы
  const handleSave = async () => {
    // Валидация
    if (!formData.title.trim() || !formData.startingMaterial.trim() || !formData.resultMaterial.trim()) {
      alert('Заполните обязательные поля: название, исходное вещество и результат');
      return;
    }

    try {
      setModalLoading(true);
      
      if (modalMode === 'create') {
        await createReactionWithImages();
        alert('Реакция успешно создана');
      } else {
        await updateReactionWithImages();
        alert('Реакция успешно обновлена');
      }
      
      // Закрываем модальное окно и обновляем список
      setShowModal(false);
      await loadReactions();
      
    } catch (err: any) {
      console.error('Ошибка сохранения:', err);
      alert('Ошибка при сохранении: ' + (err.response?.data?.description || err.message));
    } finally {
      setModalLoading(false);
    }
  };

  // Обработчик изменения полей формы
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="admin-reactions-page">
      {/* <Navigation /> */}
      <Container fluid className="mt-4">
        <h2 style={{color: "#EBF8F6"}}>/</h2>
        <h2 style={{color: "#EBF8F6"}}>/</h2>
        <BreadCrumbs />   
        
        <div className="admin-header">
          <h2>Управление реакциями</h2>
          <div className="admin-info">
            <Badge bg="info" className="me-2">
              Руководитель производства: {user?.login}
            </Badge>
            <Badge bg="success">
              Реакций: {reactions.length}
            </Badge>
            <Col md={4} className="d-flex align-items-end">
                <div className="d-flex gap-2 w-100">
                  <Button 
                    variant="success" 
                    onClick={handleCreate}
                    className="flex-fill"
                  >
                    Создать
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    onClick={loadReactions}
                    className="flex-fill"
                  >
                    Обновить
                  </Button>
                </div>
              </Col>
          </div>
        </div>

        {/* Сообщения об ошибках */}
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {/* Заголовки карточек */}
        {!loading && filteredReactions.length > 0 && (
          <div className="reactions-header mb-1">
            <div className="header-grid">
              <div className="header-cell" style={{ gridColumn: '1 / span 1' }}>ID</div>
              <div className="header-cell" style={{ gridColumn: '2 / span 1' }}>Изображение</div>
              <div className="header-cell" style={{ gridColumn: '3 / span 1' }}>Уравнение</div>
              <div className="header-cell" style={{ gridColumn: '4 / span 1' }}>Название реакции</div>
              <div className="header-cell" style={{ gridColumn: '5 / span 1' }}>Исходное вещество</div>
              <div className="header-cell" style={{ gridColumn: '6 / span 1' }}>Результат реакции</div>
              <div className="header-cell" style={{ gridColumn: '7 / span 1' }}>Подробное описание</div>
              <div className="header-cell" style={{ gridColumn: '8 / span 1' }}>Плотность (SM/RM)</div>
              <div className="header-cell" style={{ gridColumn: '9 / span 1' }}>Молярная масса (SM/RM)</div>
              <div className="header-cell" style={{ gridColumn: '10 / span 1' }}>Действия с реакцией</div>
            </div>
          </div>
        )}

        {/* Карточки реакций */}
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </Spinner>
            <p className="mt-2">Загрузка реакций...</p>
          </div>
        ) : (
          <div className="reactions-grid">
            {filteredReactions.length > 0 ? (
              filteredReactions.map((reaction) => (
                <Card key={reaction.ID} className="reaction-card">
                  <Card.Body className="reaction-card-body">
                    <div className="reaction-grid">
                      {/* ID */}
                      <div className="reaction-cell" style={{ gridColumn: '1 / span 1' }}>
                        <div className="reaction-id">#{reaction.ID}</div>
                      </div>
                      
                      {/* Изображение */}
                      <div className="reaction-cell" style={{ gridColumn: '2 / span 1' }}>
                        {reaction.Src ? (
                          <Image 
                            src={reaction.Src} 
                            alt={reaction.Title}
                            thumbnail 
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="no-image-placeholder">
                            <span>Нет изображения</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Изображение UR */}
                      <div className="reaction-cell" style={{ gridColumn: '3 / span 1' }}>
                        {reaction.SrcUr ? (
                          <Image 
                            src={reaction.SrcUr} 
                            alt={reaction.Title}
                            thumbnail 
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="no-image-placeholder">
                            <span>Нет уравнения</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Название */}
                      <div className="reaction-cell" style={{ gridColumn: '4 / span 1' }}>
                        <strong>{reaction.Title}</strong>
                      </div>
                      
                      {/* Исходное вещество */}
                      <div className="reaction-cell" style={{ gridColumn: '5 / span 1' }}>
                        {reaction.StartingMaterial}
                      </div>
                      
                      {/* Результат */}
                      <div className="reaction-cell" style={{ gridColumn: '6 / span 1' }}>
                        {reaction.ResultMaterial}
                      </div>
                      
                      {/* Описание */}
                      <div className="reaction-cell" style={{ gridColumn: '7 / span 1' }}>
                        {reaction.Details ? (
                          <span title={reaction.Details}>
                            {reaction.Details.length > 50 
                              ? reaction.Details.substring(0, 50) + '...' 
                              : reaction.Details}
                          </span>
                        ) : '-'}
                      </div>
                      
                      {/* Плотность */}
                      <div className="reaction-cell" style={{ gridColumn: '8 / span 1' }}>
                        {reaction.DensitySM || '-'} / {reaction.DensityRM || '-'}
                      </div>
                      
                      {/* Молярная масса */}
                      <div className="reaction-cell" style={{ gridColumn: '9 / span 1' }}>
                        {reaction.MolarMassSM || '-'} / {reaction.MolarMassRM || '-'}
                      </div>
                      
                      {/* Действия */}
                      <div className="reaction-cell actions-cell" style={{ gridColumn: '10 / span 1' }}>
                        <div className="reaction-actions">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleEdit(reaction)}
                            className="action-btn edit-btn"
                          >
                            Редактировать
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDelete(reaction.ID!)}
                            disabled={modalLoading}
                            className="action-btn delete-btn"
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div className="text-center mt-4">
                <Alert variant="info">
                  <h5>Реакции не найдены</h5>
                  <p>
                    {searchQuery 
                      ? 'По вашему запросу реакции не найдены' 
                      : 'Нет доступных реакций'}
                  </p>
                  <div className="mt-3">
                    <Button onClick={handleCreate}>
                      Создать первую реакцию
                    </Button>
                    {searchQuery && (
                      <Button 
                        variant="outline-primary" 
                        className="ms-2"
                        onClick={() => setSearchQuery('')}
                      >
                        Сбросить поиск
                      </Button>
                    )}
                  </div>
                </Alert>
              </div>
            )}
          </div>
        )}
      </Container>

      {/* Модальное окно создания/редактирования */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'create' ? 'Создание новой реакции' : 'Редактирование реакции'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Загрузка основного изображения */}
            <Form.Group className="mb-4">
              <Form.Label>Основное изображение реакции</Form.Label>
              <div className="image-upload-section">
                {imagePreview ? (
                  <div className="image-preview mb-3">
                    <Image 
                      src={imagePreview} 
                      alt="Превью" 
                      thumbnail 
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="mt-2"
                      onClick={() => removeSelectedFile(false)}
                    >
                      Удалить
                    </Button>
                  </div>
                ) : modalMode === 'edit' && currentReactionData?.Src ? (
                  <div className="current-image mb-3">
                    <p className="text-muted mb-2">Текущее изображение:</p>
                    <Image 
                      src={currentReactionData.Src} 
                      alt="Текущее изображение" 
                      thumbnail 
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                  </div>
                ) : null}
                
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e, false)}
                  className="mb-2"
                />
                <Form.Text className="text-muted">
                  Основное изображение реакции. Форматы: JPG, PNG, GIF
                </Form.Text>
              </div>
            </Form.Group>

            {/* Загрузка изображения UR */}
            <Form.Group className="mb-4">
              <Form.Label>Уравнение</Form.Label>
              <div className="image-upload-section">
                {imageUrPreview ? (
                  <div className="image-preview mb-3">
                    <Image 
                      src={imageUrPreview} 
                      alt="Превью уравнения" 
                      thumbnail 
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="mt-2"
                      onClick={() => removeSelectedFile(true)}
                    >
                      Удалить
                    </Button>
                  </div>
                ) : modalMode === 'edit' && currentReactionData?.SrcUr ? (
                  <div className="current-image mb-3">
                    <p className="text-muted mb-2">Текущее уравнение:</p>
                    <Image 
                      src={currentReactionData.SrcUr} 
                      alt="Текущее уравнение" 
                      thumbnail 
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                  </div>
                ) : null}
                
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e, true)}
                  className="mb-2"
                />
                <Form.Text className="text-muted">
                  Изображение уравнения. Форматы: JPG, PNG, GIF
                </Form.Text>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Название реакции <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Введите название реакции"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Подробное описание</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.details}
                onChange={(e) => handleInputChange('details', e.target.value)}
                placeholder="Опишите реакцию..."
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>
                    Исходное вещество <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.startingMaterial}
                    onChange={(e) => handleInputChange('startingMaterial', e.target.value)}
                    placeholder="Например: Салициловая кислота"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Плотность (г/мл) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.densitySM}
                    onChange={(e) => handleInputChange('densitySM', e.target.value)}
                    placeholder="Например: 1.44"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Молярная масса (г/моль) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.molarMassSM}
                    onChange={(e) => handleInputChange('molarMassSM', e.target.value)}
                    placeholder="целое число"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>
                    Результат <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.resultMaterial}
                    onChange={(e) => handleInputChange('resultMaterial', e.target.value)}
                    placeholder="Например: Ацетилсалициловая кислота"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Плотность результата (г/мл) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.densityRM}
                    onChange={(e) => handleInputChange('densityRM', e.target.value)}
                    placeholder="Например: 1.40"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Молярная масса результата (г/моль) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.molarMassRM}
                    onChange={(e) => handleInputChange('molarMassRM', e.target.value)}
                    placeholder="целое число"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="form-note mt-3">
              <small className="text-muted">
                Поля, отмеченные <span className="text-danger">*</span>, обязательны для заполнения.
                Остальные поля можно оставить пустыми.
              </small>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
            disabled={modalLoading}
          >
            Отмена
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={modalLoading || !formData.title || !formData.startingMaterial || !formData.resultMaterial}
          >
            {modalLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Сохранение...
              </>
            ) : (
              modalMode === 'create' ? 'Создать' : 'Сохранить'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
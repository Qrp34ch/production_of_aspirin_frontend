// components/InputField.tsx
import { type FC } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

interface Props {
  value: string;
  setValue: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  placeholder?: string;
  buttonTitle?: string;
}

export const InputField: FC<Props> = ({ 
  value, 
  setValue, 
  onSubmit, 
  loading, 
  placeholder = "Поиск...", 
  buttonTitle = "Найти" 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup size="lg">
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
        />
        <Button 
          variant="primary" 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Поиск...' : buttonTitle}
        </Button>
      </InputGroup>
    </Form>
  );
};
import { X } from 'lucide-react';

interface JsonExampleModalProps {
  column: any;
  onClose: () => void;
}

export default function JsonExampleModal({ column, onClose }: JsonExampleModalProps) {
  // Generate example JSON based on column type
  const generateJsonExample = (column: any) => {
    if (column.name === 'metadata') {
      return {
        version: "1.0",
        settings: {
          isPublic: true,
          notifications: {
            email: true,
            push: false
          }
        },
        tags: ["important", "featured"],
        customData: {
          key1: "value1",
          key2: 123
        }
      };
    } else if (column.type === 'jsonb') {
      return {
        data: "Example JSON data",
        nestedObject: {
          property1: "value1",
          property2: 42,
          array: [1, 2, 3]
        }
      };
    }
    
    return { example: "JSON data" };
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Ejemplo JSON para {column.name}</h3>
            <button 
              className="btn btn-sm btn-circle"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="bg-base-200 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(generateJsonExample(column), null, 2)}
            </pre>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-base-content/70">
              Este es un ejemplo de cómo puedes estructurar tus datos JSON para este campo. 
              Puedes personalizar la estructura según tus necesidades.
            </p>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              className="btn btn-primary"
              onClick={onClose}
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
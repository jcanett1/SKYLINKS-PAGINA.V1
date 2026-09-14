import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { submitContactForm } from '../lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

interface QuoteRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  cameraInfo?: {
    name: string;
    type: string;
  };
}

const QuoteRequestForm: React.FC<QuoteRequestFormProps> = ({ isOpen, onClose, cameraInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cameraType: cameraInfo?.type || '',
    cameraModel: cameraInfo?.name || '',
    message: '',
    address: '',
    preferred_contact_method: 'email'
  });

  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    phone: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (name in formErrors) {
      setFormErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      name: formData.name.trim() === '',
      email: !/^\S+@\S+\.\S+$/.test(formData.email),
      phone: !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))
    };

    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for Supabase
      const contactData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Solicitud de cotización para: ${formData.cameraModel || 'No especificado'}. 
                 Tipo: ${formData.cameraType || 'No especificado'}. 
                 Mensaje: ${formData.message || 'No hay mensaje adicional'}`,
        service_type: 'Cotización de equipo',
        address: formData.address,
        preferred_contact_method: formData.preferred_contact_method
      };

      // Submit to Supabase
      await submitContactForm(contactData);
      
      setIsSubmitted(true);
      
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          cameraType: '',
          cameraModel: '',
          message: '',
          address: '',
          preferred_contact_method: 'email'
        });
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Hubo un error al enviar el formulario. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Determinar si es una cámara o un sistema de grabación
  const isCamera = cameraInfo?.type && ['ip', 'wifi', 'solar', 'doble lente'].includes(cameraInfo.type);
  const isRecordingSystem = cameraInfo?.type && ['nvr', 'dvr'].includes(cameraInfo.type);
  
  // Título y etiquetas según el tipo de producto
  const productTitle = isCamera ? 'Cámara' : isRecordingSystem ? 'Sistema de Grabación' : 'Producto';
  const productTypeLabel = isCamera ? 'Tipo de Cámara' : isRecordingSystem ? 'Tipo de Sistema' : 'Tipo de Producto';
  const productModelLabel = isCamera ? 'Modelo de Cámara' : isRecordingSystem ? 'Modelo de Sistema' : 'Modelo';

  return (
    <>
      <Toaster position="top-center" />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b">
            <h3 className="text-xl font-bold text-gray-900">Solicitar Cotización</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    placeholder="Ingrese su nombre completo"
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-500">Por favor ingrese su nombre</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                      placeholder="ejemplo@correo.com"
                    />
                    {formErrors.email && <p className="mt-1 text-sm text-red-500">Ingrese un correo válido</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                      placeholder="10 dígitos"
                    />
                    {formErrors.phone && <p className="mt-1 text-sm text-red-500">Ingrese un número válido de 10 dígitos</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Dirección donde se instalará el equipo"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cameraType" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Producto
                    </label>
                    <select
                      id="cameraType"
                      name="cameraType"
                      value={formData.cameraType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Seleccione un tipo</option>
                      <optgroup label="Cámaras de Seguridad">
                        <option value="ip">Cámaras IP</option>
                        <option value="wifi">Cámaras WiFi</option>
                        <option value="solar">Cámaras Recargables</option>
                        <option value="doble lente">Cámaras Doble Lente</option>
                      </optgroup>
                      <optgroup label="Sistemas de Grabación">
                        <option value="nvr">NVR (Network Video Recorder)</option>
                        <option value="dvr">DVR (Digital Video Recorder)</option>
                      </optgroup>
                      <optgroup label="Equipos WiFi">
                        <option value="access-points-empresariales">Access Points Empresariales</option>
                        <option value="sistemas-mesh">Sistemas WiFi Mesh</option>
                        <option value="access-points-exterior">Access Points para Exterior</option>
                        <option value="routers-inalambricos">Routers Inalámbricos</option>
                      </optgroup>
                      <optgroup label="Sistemas de Alarma">
                        <option value="alarmas-residenciales">Alarmas Residenciales</option>
                        <option value="alarmas-comerciales">Alarmas Comerciales</option>
                        <option value="alarmas-industriales">Alarmas Industriales</option>
                      </optgroup>
                      <optgroup label="Infraestructura de Red">
                        <option value="switches">Switches de Red</option>
                        <option value="routers">Routers</option>
                        <option value="gabinetes">Gabinetes de Red</option>
                        <option value="cableado">Cableado Estructurado</option>
                      </optgroup>
                      <optgroup label="Para tu Hogar">
                         <option value="Chapas de Seguridad">Chapas de seguridad</option>
                        <option value="Rings">Camaras RING</option>
                        <option value="apagadores y contactos inteligentes">Apagadores y contacos inteligentes</option>
                        </optgroup>
                      <optgroup label="Otros Servicios">
                        <option value="instalacion">Instalación y Configuración</option>
                        <option value="mantenimiento">Mantenimiento</option>
                        <option value="consultoria">Consultoría Técnica</option>
                      </optgroup>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="preferred_contact_method" className="block text-sm font-medium text-gray-700 mb-1">
                      Método de contacto preferido
                    </label>
                    <select
                      id="preferred_contact_method"
                      name="preferred_contact_method"
                      value={formData.preferred_contact_method}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="email">Correo electrónico</option>
                      <option value="phone">Teléfono</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="cameraModel" className="block text-sm font-medium text-gray-700 mb-1">
                    Modelo o Especificaciones
                  </label>
                  <input
                    type="text"
                    id="cameraModel"
                    name="cameraModel"
                    value={formData.cameraModel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Modelo específico o especificaciones del producto"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje o Requerimientos Adicionales
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Describa sus necesidades específicas o cualquier información adicional"
                  ></textarea>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'} transition-colors`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar Solicitud
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">¡Solicitud Enviada!</h3>
                <p className="text-gray-600">
                  Gracias por su interés. Nos pondremos en contacto con usted a la brevedad para brindarle una cotización personalizada.
                </p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t bg-gray-50 text-xs text-gray-500 text-center">
            Sus datos están seguros y solo serán utilizados para contactarle respecto a su solicitud de cotización.
          </div>
        </div>
      </div>
    </>
  );
};

export default QuoteRequestForm;
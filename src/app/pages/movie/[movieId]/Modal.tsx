import React from 'react';

interface ModalProps {
  videoUrl: string;
  title: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ videoUrl, title, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-third rounded-md overflow-hidden w-full max-w-3xl z-50">
        <div className='items-center flex justify-between px-3 py-2'>
            <h2 className="text-lg font-semibold text-center max-w-[90%] truncate">{title}</h2>
            <div className="text-2xl font-bold" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </div>
        </div>
        <div className="relative w-full h-0 pb-[56.25%]">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={videoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
    </div>
  );
};

export default Modal;

import React, { useState } from 'react';
import axios from 'axios';

interface PlotSection {
  section: string;
  content: string;
}

interface PlotSummaryProps {
  movie: { title: string; year: string, director: string };
}

const PlotSummary: React.FC<PlotSummaryProps> = ({ movie }) => {
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<PlotSection[]>([]);
  const [showAllSections, setShowAllSections] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;

  const fetchPlot = async (prompt: string) => {
    setLoading(true);
    try {
        const response = await axios.post(`${BASE_URL}/api/v1/gpt/plot`, { text: prompt });
        const result = response.data.query.parts[0].text;

        if (typeof result === 'string') {
          const parsedSections: PlotSection[] = JSON.parse(result) || [];
          setSections(parsedSections);
        } else {
          console.error('Unexpected result format:', result);
        }
    } catch (error) {
      console.error('Error fetching plot:', error);
    } finally {
      setLoading(false);
    }
  };

  const tellPlot = (val: string) => {
    const prompt = val === 'spoilers'
      ? `полный сюжет фильма ${movie.title} ${movie.year} года от режиссера ${movie.director}`
      : `расскажи про фильм без спойлеров ${movie.title} ${movie.year} года от режиссера ${movie.director}`;
    
    fetchPlot(prompt);
  };

  const toggleSectionsVisibility = () => {
    setShowAllSections(!showAllSections);
  };

  return (
    <div className='mt-12 space-y-4'>
      <div className='flex space-x-2 items-center'>
        <h3 className='text-lg text-center font-bold'>Пересказ сюжета от ИИ</h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19.898.855a.4.4 0 0 0-.795 0c-.123 1.064-.44 1.802-.943 2.305-.503.503-1.241.82-2.306.943a.4.4 0 0 0 .001.794c1.047.119 1.801.436 2.317.942.512.504.836 1.241.93 2.296a.4.4 0 0 0 .796 0c.09-1.038.413-1.792.93-2.308.515-.516 1.269-.839 2.306-.928a.4.4 0 0 0 .001-.797c-1.055-.094-1.792-.418-2.296-.93-.506-.516-.823-1.27-.941-2.317Z"></path>
          <path fill="currentColor" d="M12.001 1.5a1 1 0 0 1 .993.887c.313 2.77 1.153 4.775 2.5 6.146 1.34 1.366 3.3 2.223 6.095 2.47a1 1 0 0 1-.003 1.993c-2.747.238-4.75 1.094-6.123 2.467-1.373 1.374-2.229 3.376-2.467 6.123a1 1 0 0 1-1.992.003c-.248-2.795-1.105-4.754-2.47-6.095-1.372-1.347-3.376-2.187-6.147-2.5a1 1 0 0 1-.002-1.987c2.818-.325 4.779-1.165 6.118-2.504 1.339-1.34 2.179-3.3 2.504-6.118A1 1 0 0 1 12 1.5ZM6.725 11.998c1.234.503 2.309 1.184 3.21 2.069.877.861 1.56 1.888 2.063 3.076.5-1.187 1.18-2.223 2.051-3.094.871-.87 1.907-1.55 3.094-2.05-1.188-.503-2.215-1.187-3.076-2.064-.885-.901-1.566-1.976-2.069-3.21-.505 1.235-1.19 2.3-2.081 3.192-.891.89-1.957 1.576-3.192 2.082Z"></path>
        </svg>
      </div>
      <div className='flex space-x-2 text-base font-semibold'>
        <p className='px-2 py-2 border-[2px] bg-focus text-white rounded-lg cursor-pointer' onClick={() => tellPlot('spoilers')}>Со спойлерами</p>
        <p className='px-2 py-2 border-[2px] bg-focus text-white rounded-lg cursor-pointer' onClick={() => tellPlot('no spoilers')}>Без спойлеров</p>
      </div>

      <div className="pt-6 space-y-8">
        {loading && (
          <div className='justify-center items-center flex'>
            <div className="loader"></div>
          </div>
        )}
        {sections.length > 0 && (
          <div className="space-y-2">
            {sections[0] && (
              <div>
                <h3 className="text-xl font-bold">{sections[0].section}</h3>
                <p className="text-base font-semibold pt-2">{sections[0].content}</p>
                <div className='border-b-2 border-gray-300 w-full pt-8'></div>
              </div>
            )}
            {!showAllSections && sections.slice(1, 2).map((section, index) => (
              <div key={index + 1} className="space-y-2 pt-4">
                <h3 className="text-xl font-bold">{section.section}</h3>
                <p className="text-base font-semibold">{section.content}</p>
                <div className='border-b-2 border-gray-300 w-full pt-8'></div>
              </div>
            ))}
            {showAllSections && sections.slice(1).map((section, index) => (
              <div key={index + 1} className="space-y-2 pt-4">
                <h3 className="text-xl font-bold">{section.section}</h3>
                <p className="text-base font-semibold">{section.content}</p>
                <div className='border-b-2 border-gray-300 w-full pt-8'></div>
              </div>
            ))}
            <button onClick={toggleSectionsVisibility} className='px-4 py-2 border bg-focus text-white rounded-lg cursor-pointer'>
              {showAllSections ? 'Скрыть' : 'Показать весь сюжет'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlotSummary;

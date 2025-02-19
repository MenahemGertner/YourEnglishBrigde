import useOpenWindow from "../hooks/openWindow";
import { ChevronDown, ChevronUp} from 'lucide-react';

const ExpandableSection = ({ title, content, sectionTitle, isGrid }) => {
    const { isOpen, toggleSection } = useOpenWindow(sectionTitle);
  
    return (
      <div className={`${isGrid ? 'relative p-8 bg-gradient-to-r from-blue-50 via-white to-purple-50 border rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)]' : 'p-4'}`}>
        <button 
          onClick={() => toggleSection(sectionTitle)} 
          className="w-full flex justify-between items-center mb-4 toggle-button"
        >
          <span className="font-semibold">{title}</span>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
  
        {isOpen && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border rounded-lg shadow-lg p-2 z-[50] max-w-full window-content max-h-[90vh] overflow-y-auto">
            {content}
          </div>
        )}
      </div>
    );
  };
  
  const WindooMode = ({ sections = [] }) => {
    const { activeSection} = useOpenWindow();
  
    return (
      <>
        <div className="md:hidden w-80 min-w-[250px] sm:w-80 mx-2 sm:mx-auto bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-b-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] divide-y">
          {sections.map((section, index) => (
            <ExpandableSection
              key={index}
              title={section.title}
              content={section.content}
              sectionTitle={section.title}
              isGrid={false}
            />
          ))}
        </div>
  
        <div className="hidden md:grid sm:grid-cols-2 gap-6 w-[48vw] h-56 mx-auto p-8 bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
          {sections.map((section, index) => (
            <ExpandableSection
              key={index}
              title={section.title}
              content={section.content}
              sectionTitle={section.title}
              isGrid={true}
            />
          ))}
        </div>
      </>
    );
  };

export default WindooMode;
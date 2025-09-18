
import React from 'react';
import { PlanSection, PlanSubSection } from '../types';

const SubSection: React.FC<{ sub: PlanSubSection }> = ({ sub }) => {
    const renderDetails = () => {
        switch (sub.type) {
            case 'list':
                return (
                    <ul className="list-disc list-inside space-y-2 text-slate-600">
                        {(sub.details as string[]).map((item, index) => (
                            <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                        ))}
                    </ul>
                );
            case 'table':
                const tableData = sub.details as Record<string, string>[];
                if (tableData.length === 0) return null;
                const headers = Object.keys(tableData[0]);
                return (
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    {headers.map(header => (
                                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {tableData.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-slate-50">
                                        {headers.map((header, cellIndex) => (
                                            <td key={`${rowIndex}-${cellIndex}`} className="px-6 py-4 text-sm text-slate-600">{row[header]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'code':
                return (
                    <pre className="bg-slate-800 text-slate-200 p-4 rounded-lg overflow-x-auto text-sm">
                        {/* Fix: Assert 'sub.details' as a string for code blocks, as its type is a union. */}
                        <code>{sub.details as string}</code>
                    </pre>
                );
            case 'component':
                // Fix: Assert 'sub.details' as React.ReactNode to render it as a component.
                return <>{sub.details as React.ReactNode}</>;
            default:
                // Fix: Assert 'sub.details' as a string for the default text case.
                return <p className="text-slate-600 leading-relaxed">{sub.details as string}</p>;
        }
    };

    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-700 mb-3">{sub.subtitle}</h3>
            {renderDetails()}
        </div>
    );
};


const ContentDisplay: React.FC<{ sections: PlanSection[] }> = ({ sections }) => {
  const [activeSection, setActiveSection] = React.useState<string>(sections[0]?.id || '');

  React.useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && sections.some(s => s.id === hash)) {
      setActiveSection(hash);
    }
  }, [sections]);

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Sticky Sidebar */}
      <aside className="lg:w-1/4 lg:sticky lg:top-8 self-start">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Project Plan Sections</h2>
        <nav>
          <ul className="space-y-2">
            {sections.map(section => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(section.id);
                    window.history.pushState(null, '', `/plan#${section.id}`);
                  }}
                  className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                    activeSection === section.id
                      ? 'bg-cyan-100 text-cyan-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <section.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{section.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:w-3/4">
        {currentSection ? (
            <div id={currentSection.id} className="bg-white p-6 sm:p-8 rounded-lg shadow">
                 <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200">
                    <div className="bg-cyan-500/20 text-cyan-600 rounded-lg p-3">
                        <currentSection.icon className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">{currentSection.title}</h1>
                 </div>
                 
                 {currentSection.content.map((sub, index) => (
                     <SubSection key={index} sub={sub} />
                 ))}
            </div>
        ) : (
            <p>Select a section to view its content.</p>
        )}
      </main>
    </div>
  );
};

export default ContentDisplay;

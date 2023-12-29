import { LoadingCircle } from '../icons';
import React, { useState, useEffect } from 'react';
import UploadFiles_Configure from './UploadFiles_Component';
import { statusToProgress as statusToProgressRecord } from './statusToProgress';

const statusToProgress: Record<string, number> = statusToProgressRecord;

interface WelcomeFormProps {
  assistantName: string;
  setAssistantName: (name: string) => void;
  setAssistantId: (id: string) => void;
  assistantDescription: string;
  setAssistantDescription: (description: string) => void;
  assistantModel: string;
  setAssistantModel: (model: string) => void;
  startChatAssistant: () => void;
  isButtonDisabled: boolean;
  isStartLoading: boolean;
  statusMessage: string;
  fileIds: string[];
  setFileIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const WelcomeForm: React.FC<WelcomeFormProps> = ({
  assistantName,
  setAssistantName,
  setAssistantId,
  assistantDescription,
  setAssistantDescription,
  assistantModel,
  setAssistantModel,
  startChatAssistant,
  isButtonDisabled,
  isStartLoading,
  statusMessage,
  fileIds,
  setFileIds,
}) => {

  const [lastProgress, setLastProgress] = useState(0);
  const [selectedAssistant, setSelectedAssistant] = useState('');
  const baseStatusMessage = statusMessage.split(' (')[0];
  let progress = statusToProgress[baseStatusMessage] || 0;

  if (progress === 0 && lastProgress !== 0) {
    progress = lastProgress;
  } else if (progress !== lastProgress) {
    setLastProgress(progress);
  }

  const handleFileIdUpdate = (fileId: string) => {
    console.log("WelcomeForm: New file ID added:", fileId);
    setFileIds(prevFileIds => [...prevFileIds, fileId]);
  };
  
  const handleActiveFileIdsUpdate = (activeFileIds: string[]) => {
    setFileIds(activeFileIds);
  };


  if (progress === 0 && lastProgress !== 0) {
    progress = lastProgress;
  } else if (progress !== lastProgress) {
    setLastProgress(progress);
  }

  useEffect(() => {
    console.log("Aktive Datei-IDs:", fileIds);
  }, [fileIds]);

  // function getExistingAssistantsInfo(): { name: string; id: string }[] {
  //   const rawAssistantInfo = process.env.EXISTING_ASSISTANT_IDS?.split(",") ?? [];
  //   const result = [];
  //   for (let i = 0; i < rawAssistantInfo.length; i += 2) {
  //     result.push({ name: rawAssistantInfo[i], id: rawAssistantInfo[i + 1] });
  //   }
  //   return result;
  // }

  // const existingAssistants = getExistingAssistantsInfo();

  const existingAssistants = [
    { name: 'Electric Tools Testing', id: 'asst_9zigQXvhf57zlbV7GpaUZ9fI' },
    { name: 'Electric Tools Demo', id: 'asst_TDQ575yyfDCBAvz2PNsmJ5wk' },
    { name: 'Electric Tools Manager Demo', id: 'asst_R947Iuv6mkkPwimzAZxovt3a' },
    { name: 'GX30 mAgIc Assistant', id: 'asst_l55dsFKCNhxyAPGUncJONLf5' },
  ]


  return (
    <div className="border-gray-500 bg-gray-200 sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border-2 sm:w-full">
      <div className="flex flex-col space-y-4 p-7 sm:p-10">
        <h1 className="text-lg font-semibold text-black">
          Welcome to Agent42!
        </h1>
        
        {existingAssistants.length !== 0 ? (
          <>
            <div className="flex flex-col space-y-3">
            {existingAssistants?.map((assistant: { id: string; name: string; }) => (
              <button
                key={assistant.id}
                type="button"
                onClick={() => setSelectedAssistant(assistant.id)}
                className={`p-1 border border-gray-400 rounded-md ${selectedAssistant === assistant.id ? 'bg-blue-500 text-white' : ''}`}
              >
                {assistant.name}
              </button>
            ))}
            </div>
            <div className="flex justify-center p-4">
              <button
                type="button"
                onClick={() => setAssistantId(selectedAssistant)}
                className="w-full p-2 rounded-md bg-green-500 text-white flex justify-center items-center relative overflow-hidden"
                style={{
                  position: 'relative',
                  opacity: isButtonDisabled ? 0.5 : 1,
                }}
              >
                {isStartLoading && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${progress}%`,
                      background: 'rgba(0, 0, 0, 0.2)'
                    }} />
                )}
                {isStartLoading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <LoadingCircle />
                    <p className="text-sm text-gray-700">{statusMessage}</p>
                  </div>
                ) : "Start"}
              </button>
            </div>
          </>
        ) : (
          <><form className="flex flex-col space-y-3">
              <input
                type="text"
                placeholder="Assistant Name"
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
                required
                className="p-2 border border-gray-200 rounded-md" />
              <input
                type="text"
                placeholder="Assistant Description"
                value={assistantDescription}
                onChange={(e) => setAssistantDescription(e.target.value)}
                required
                className="p-2 border border-gray-200 rounded-md" />
              <div>
                <button
                  type="button"
                  onClick={() => setAssistantModel('gpt-4-1106-preview')}
                  className={`p-1 border border-gray-400 rounded-md ${assistantModel === 'gpt-4-1106-preview' ? 'bg-blue-500 text-white' : ''}`}
                  disabled={process.env.NEXT_PUBLIC_DEMO_MODE === 'true'}
                >
                  GPT-4
                </button>
                <button
                  type="button"
                  onClick={() => setAssistantModel('gpt-3.5-turbo-1106')}
                  className={`p-1 border border-gray-400 rounded-md ${assistantModel === 'gpt-3.5-turbo-1106' ? 'bg-blue-500 text-white' : ''}`}
                >
                  GPT-3.5
                </button>
              </div>
            </form><div className="upload-files-container">
                <UploadFiles_Configure
                  onFileIdUpdate={handleFileIdUpdate}
                  setActiveFileIds={handleActiveFileIdsUpdate} />
              </div>
            <div className="flex justify-center p-4">
              <button
                type="button"
                onClick={startChatAssistant}
                disabled={isButtonDisabled || !assistantName || !assistantDescription || fileIds.length === 0|| fileIds.some(fileId => typeof fileId === 'undefined')}
                className="w-full p-2 rounded-md bg-green-500 text-white flex justify-center items-center relative overflow-hidden"
                style={{ 
                  position: 'relative', 
                  opacity: isButtonDisabled ? 0.5 : 1,
                }}
              >
                {isStartLoading && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      left: 0, 
                      top: 0, 
                      height: '100%', 
                      width: `${progress}%`, 
                      background: 'rgba(0, 0, 0, 0.2)' 
                    }} 
                  />
                )}
                {isStartLoading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <LoadingCircle />
                    <p className="text-sm text-gray-700">{statusMessage}</p>
                  </div>
                ) : "Start"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomeForm;

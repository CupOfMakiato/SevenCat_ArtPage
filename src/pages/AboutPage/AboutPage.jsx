import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import LoadingOverlay from '../../components/Common/LoadingOverlay';
import { 
  viewAllListsByBoardId, 
  viewAllCardsByListId, 
  viewCardAttachments 
} from '../../api/trello-api';

const AboutPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        
        const lists = await viewAllListsByBoardId();
        
        const profileList = lists.find(list => 
          list.name.toLowerCase().includes('profile')
        );
        
        if (!profileList) {
          throw new Error('Profile list not found');
        }
        
        const cards = await viewAllCardsByListId(profileList.id);
        
        if (!cards || cards.length === 0) {
          throw new Error('No cards found in Profile list');
        }
        
        const profileCard = cards[0]; // Use first card or find specific one
        
        const attachments = await viewCardAttachments(profileCard.id);
        
        const profileImage = attachments.find(att => 
          att.mimeType && att.mimeType.startsWith('image/')
        );
        
        setProfileData({
          name: profileCard.name,
          description: profileCard.desc,
          imageUrl: profileImage ? profileImage.url : null,
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading about data:', err);
        setError(`Failed to load profile information: ${err.message}`);
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <LoadingOverlay show={loading} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-screen bg-white flex items-center justify-center py-20 px-6">
        <div className="max-w-4xl w-full">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
            {/* Profile Image */}
            <div className="flex-shrink-0 group cursor-pointer">
              <div className="w-64 h-64 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200  transition-transform duration-500 ease-in-out group-hover:scale-110">
                {profileData?.imageUrl ? (
                  <img
                    src={profileData.imageUrl}
                    alt={profileData.name}
                    className="w-full h-full object-cover pointer-events-none select-none"
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none',
                      WebkitTouchCallout: 'none',
                      WebkitUserDrag: 'none',
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="flex-1 text-center md:text-left">
              {/* Name */}
              <h1 className="text-5xl md:text-6xl font-bold text-orange-500 mb-4">
                7Catto
              </h1>
              
              {/* Description */}
              <div className="text-gray-700 text-lg leading-relaxed space-y-4">
                {profileData?.description ? (
                  profileData.description.split('\n').map((line, index) => (
                    line.trim() && <p key={index}>{line}</p>
                  ))
                ) : (
                  <p>Shrimp Artist, Certified night Owl :3</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;

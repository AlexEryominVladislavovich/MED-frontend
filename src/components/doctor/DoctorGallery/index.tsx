import React, { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules';
import { DoctorPhoto } from '../../../types';
import styles from './styles.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface DoctorGalleryProps {
  mainPhotoUrl: string;
  photos: DoctorPhoto[];
  selectedPhotoIndex: number;
  onPhotoSelect?: (index: number) => void;
}

const DoctorGallery: React.FC<DoctorGalleryProps> = ({
  mainPhotoUrl,
  photos,
  selectedPhotoIndex,
  onPhotoSelect,
}) => {
  const [activeIndex, setActiveIndex] = useState(selectedPhotoIndex);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [swiper, setSwiper] = useState<any>(null);
  
  // Combine main photo with additional photos
  const allPhotos = [
    { id: -1, photo_url: mainPhotoUrl, order: -1 },
    ...photos,
  ];

  useEffect(() => {
    setActiveIndex(selectedPhotoIndex);
    if (swiper) {
      swiper.slideTo(selectedPhotoIndex + 1);
    }
  }, [selectedPhotoIndex, swiper]);

  useEffect(() => {
    // Предварительная загрузка изображений
    const preloadImages = async () => {
      const imagePromises = allPhotos.map((photo) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = photo.photo_url;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setImagesLoaded(true); // Still set to true to show images even if some fail
      }
    };

    preloadImages();
  }, [allPhotos]);

  const handleSlideChange = useCallback((swiper: any) => {
    const newIndex = swiper.realIndex;
    setActiveIndex(newIndex);
    if (onPhotoSelect) {
      onPhotoSelect(newIndex);
    }
  }, [onPhotoSelect]);

  const generateSrcSet = (url: string) => {
    return `
      ${url} 500w,
      ${url} 800w,
      ${url} 1200w
    `;
  };

  if (!photos || photos.length === 0) {
    return (
      <div className={styles.singlePhotoContainer}>
        <img 
          src={mainPhotoUrl} 
          alt="Doctor photo"
          className={styles.mainPhoto}
          loading="eager"
          srcSet={generateSrcSet(mainPhotoUrl)}
          sizes="(max-width: 500px) 100vw, (max-width: 800px) 800px, 1200px"
        />
      </div>
    );
  }

  return (
    <div 
      className={`${styles.galleryContainer} ${imagesLoaded ? styles.loaded : ''}`}
      style={{ visibility: imagesLoaded ? 'visible' : 'hidden' }}
    >
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 5,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: true,
        }}
        speed={600}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
        className={styles.swiper}
        initialSlide={selectedPhotoIndex}
        onSlideChange={handleSlideChange}
        onSwiper={setSwiper}
        loop={true}
        preloadImages={false}
        lazy={{
          loadPrevNext: true,
          loadPrevNextAmount: 3,
          loadOnTransitionStart: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        watchSlidesProgress={true}
        observer={true}
        observeParents={true}
        resizeObserver={true}
      >
        {allPhotos.map((photo, index) => (
          <SwiperSlide 
            key={photo.id} 
            className={styles.swiperSlide}
            virtualIndex={index}
          >
            <div 
              className={`${styles.slideContent} ${index === activeIndex ? styles.active : ''}`}
              style={{
                transform: `scale(${index === activeIndex ? '1' : '0.9'}) translateZ(0)`,
                opacity: index === activeIndex ? '1' : '0.7',
              }}
            >
              <img
                src={photo.photo_url}
                alt={`Photo ${index + 1}`}
                className={styles.slideImage}
                loading={index <= 2 ? "eager" : "lazy"}
                srcSet={generateSrcSet(photo.photo_url)}
                sizes="(max-width: 500px) 100vw, (max-width: 800px) 800px, 1200px"
                onLoad={() => {
                  if (index === 0) {
                    setImagesLoaded(true);
                  }
                }}
                style={{
                  transform: `scale(${index === activeIndex ? '1.02' : '1'})`,
                  transition: 'transform 0.5s ease-out',
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DoctorGallery;

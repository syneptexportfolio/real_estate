/**
 * Floating Cinematic HUD & Architectural Storyteller Component.
 * Updates chapter indicators, scene title, fades hero text, and orchestrates
 * contextual narrative intro/outro overlays across chapters 03 to 11.
 */

import { getSceneForFrame } from '../data/scenesConfig.js';

export function initCinematicHUD(frameEngine) {
  const chapterPill = document.querySelector('.hud-chapter-text') || document.querySelector('.hud-chapter-pill');
  const sceneTitle = document.querySelector('.hud-scene-title');
  const sceneSubtitle = document.querySelector('.hud-scene-subtitle');
  const heroCenter = document.querySelector('.hud-center-title');
  const scrollPill = document.querySelector('.scroll-indicator-pill');

  // Storyteller Overlay elements
  const storyCard = document.querySelector('#hud-story-card');
  const storyEyebrow = document.querySelector('.hud-story-eyebrow');
  const storyTitle = document.querySelector('.hud-story-title');
  const storyDesc = document.querySelector('.hud-story-desc');
  const storyMeta = document.querySelector('.hud-story-meta');

  let activeStoryId = null;

  if (!frameEngine) return;

  frameEngine.onSceneChange((scene, progress, frameIndex) => {
    if (chapterPill) {
      chapterPill.textContent = scene.chapter;
    }
    if (sceneTitle) {
      sceneTitle.textContent = scene.name;
    }
    if (sceneSubtitle) {
      sceneSubtitle.textContent = scene.subtitle;
    }
  });

  // Listen to frame engine progress changes to adjust HUD text opacity and story card
  frameEngine.scrollController.onFrameChange((frameIndex, progress) => {
    // 1. Fade out hero text as user scrolls into the journey (Frames 0..85)
    if (heroCenter) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const startFade = isMobile ? 0.015 : 0.08;
      const endFade = isMobile ? 0.09 : 0.18;

      if (progress < startFade) {
        heroCenter.style.opacity = '1';
        heroCenter.style.transform = 'translateY(0)';
        heroCenter.style.pointerEvents = 'auto';
      } else if (progress < endFade) {
        const fade = 1 - (progress - startFade) / (endFade - startFade);
        heroCenter.style.opacity = `${Math.max(0, fade)}`;
        const moveDist = isMobile ? 36 : 20;
        heroCenter.style.transform = `translateY(-${(1 - fade) * moveDist}px)`;
        heroCenter.style.pointerEvents = 'none';
      } else {
        heroCenter.style.opacity = '0';
        heroCenter.style.pointerEvents = 'none';
      }
    }

    // 2. Fade out scroll pill and journey tag after initial scroll
    if (scrollPill) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const startPill = isMobile ? 0.01 : 0.05;
      const endPill = isMobile ? 0.06 : 0.12;

      if (progress < startPill) {
        scrollPill.style.opacity = '1';
      } else if (progress < endPill) {
        const fade = 1 - (progress - startPill) / (endPill - startPill);
        scrollPill.style.opacity = `${Math.max(0, fade)}`;
      } else {
        scrollPill.style.opacity = '0';
      }
    }

    const journeyTag = document.querySelector('.hud-journey-tag');
    if (journeyTag) {
      if (progress < 0.08) {
        journeyTag.style.opacity = '1';
      } else if (progress < 0.15) {
        const fade = 1 - (progress - 0.08) / 0.07;
        journeyTag.style.opacity = `${Math.max(0, fade)}`;
      } else {
        journeyTag.style.opacity = '0';
      }
    }

    // 3. Manage top-right scene status: show in hero, fade out during story chapters to prevent text duplication
    const sceneStatus = document.querySelector('.hud-scene-status');
    if (sceneStatus) {
      if (progress < 0.08) {
        sceneStatus.style.opacity = '1';
      } else if (progress < 0.16) {
        const fade = 1 - (progress - 0.08) / 0.08;
        sceneStatus.style.opacity = `${Math.max(0, fade)}`;
      } else {
        sceneStatus.style.opacity = '0';
      }
    }

    // 4. Dynamic Story Intro & Outro (Chapters 03 to 11)
    if (storyCard) {
      const scene = getSceneForFrame(frameIndex);

      if (!scene || !scene.hasStoryOverlay) {
        storyCard.style.opacity = '0';
        storyCard.style.pointerEvents = 'none';
        storyCard.style.transform = 'translate(-50%, 20px)';
        activeStoryId = null;
      } else {
        // Update story card contents when entering a new chapter
        if (activeStoryId !== scene.id) {
          activeStoryId = scene.id;
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
          const cleanEyebrow = isMobile && scene.storyEyebrow
            ? scene.storyEyebrow.replace(/^\d+\s*\/\s*\d+\s*—\s*/, '')
            : scene.storyEyebrow;

          if (storyEyebrow && cleanEyebrow) storyEyebrow.textContent = cleanEyebrow;
          if (storyTitle && scene.storyTitle) storyTitle.textContent = scene.storyTitle;
          if (storyDesc && scene.storyDescription) storyDesc.textContent = scene.storyDescription;
          if (storyMeta && Array.isArray(scene.storyTags)) {
            storyMeta.innerHTML = scene.storyTags
              .map(tag => `<span class="hud-story-tag">${tag}</span>`)
              .join('<span class="hud-story-sep" aria-hidden="true">&bull;</span>');
          }
        }

        // Calculate progress within the current scene: 0.0 (start) to 1.0 (end)
        const sceneSpan = Math.max(1, scene.endFrame - scene.startFrame);
        const sceneProgress = Math.max(0, Math.min(1, (frameIndex - scene.startFrame) / sceneSpan));

        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const maxIntroY = isMobile ? 18 : 36;
        const maxOutroY = isMobile ? 14 : 26;

        let opacity = 0;
        let translateY = 0;
        let scale = 1;

        // Intro transition: frames 0% to 22% of this scene (popup from down to up)
        if (sceneProgress < 0.22) {
          const introFactor = sceneProgress / 0.22;
          opacity = Math.max(0, Math.min(1, introFactor));
          scale = 0.94 + introFactor * 0.06;
          translateY = (1 - introFactor) * maxIntroY;
        }
        // Reading / Sustained zone: frames 22% to 78% of this scene
        else if (sceneProgress <= 0.78) {
          opacity = 1;
          translateY = 0;
          scale = 1;
        }
        // Outro transition: frames 78% to 100% of this scene (pops up from down to up as it dissolves)
        else {
          const outroFactor = (sceneProgress - 0.78) / 0.22;
          opacity = Math.max(0, Math.min(1, 1 - outroFactor));
          scale = 1.0 - outroFactor * 0.03;
          translateY = -outroFactor * maxOutroY;
        }

        storyCard.style.opacity = opacity.toFixed(3);
        storyCard.style.transform = `translate(-50%, ${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        storyCard.style.pointerEvents = opacity > 0.4 ? 'auto' : 'none';
      }
    }
  });
}

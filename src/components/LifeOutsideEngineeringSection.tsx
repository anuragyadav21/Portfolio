import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { lifeLinks, lifeMedia, youtubeThumbnail } from "../data/lifeLinks";
import {
  lifeSectionIntro,
  lifeThread,
  pianoCard,
  spotlightCard,
} from "../data/lifeOutsideEngineering";
import { studioFeaturedId, studioPieces } from "../data/lifeStudio";
import type { StudioPiece } from "../types";
import { getStudioStackLayout } from "../utils/studioStackLayout";
import { SectionHeader } from "./SectionHeader";

const featuredPiece = studioPieces.find((p) => p.id === studioFeaturedId) ?? studioPieces[0];
const stackedPieces = studioPieces.filter((p) => p.id !== featuredPiece.id);

function RibbonMedia({
  href,
  src,
  alt,
  fit = "cover",
}: {
  href: string;
  src: string;
  alt: string;
  fit?: "cover" | "contain";
}) {
  if (!href || !src) return null;
  return (
    <a
      className={["life-ribbon-media-link", fit === "contain" ? "contain" : ""].filter(Boolean).join(" ")}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={alt}
    >
      <img src={src} alt="" loading="lazy" />
    </a>
  );
}

const LIGHTBOX_MIN_SCALE = 1;
const LIGHTBOX_MAX_SCALE = 5;

function StudioLightbox({ piece, onClose }: { piece: StudioPiece; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ active: false, moved: false, startX: 0, startY: 0, panX: 0, panY: 0 });
  const clickZoomTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clampScale = (value: number) =>
    Math.min(LIGHTBOX_MAX_SCALE, Math.max(LIGHTBOX_MIN_SCALE, value));

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setScale((s) => clampScale(s * 1.2));
      if (e.key === "-") setScale((s) => clampScale(s / 1.2));
      if (e.key === "0") resetView();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      if (clickZoomTimer.current) clearTimeout(clickZoomTimer.current);
    };
  }, [onClose]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    setScale((s) => {
      const next = clampScale(s * factor);
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current.moved = false;
    if (scale <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      ...dragRef.current,
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragRef.current.moved = true;
    setPan({
      x: dragRef.current.panX + dx,
      y: dragRef.current.panY + dy,
    });
  };

  const endDrag = () => {
    dragRef.current.active = false;
    setDragging(false);
  };

  const zoomInStep = () => {
    setScale((s) => {
      const next = clampScale(s * 1.25);
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dragRef.current.moved) return;
    if (clickZoomTimer.current) clearTimeout(clickZoomTimer.current);
    clickZoomTimer.current = setTimeout(() => {
      clickZoomTimer.current = null;
      zoomInStep();
    }, 220);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickZoomTimer.current) {
      clearTimeout(clickZoomTimer.current);
      clickZoomTimer.current = null;
    }
    if (scale > 1) resetView();
    else setScale(2.5);
  };

  return (
    <div className="life-lightbox" role="dialog" aria-modal="true" aria-label={piece.title} onClick={onClose}>
      <button type="button" className="life-lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>

      <div className="life-lightbox-toolbar" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="life-lightbox-zoom-btn" onClick={() => setScale((s) => clampScale(s / 1.25))} aria-label="Zoom out">
          −
        </button>
        <span className="life-lightbox-zoom-pct">{Math.round(scale * 100)}%</span>
        <button type="button" className="life-lightbox-zoom-btn" onClick={() => setScale((s) => clampScale(s * 1.25))} aria-label="Zoom in">
          +
        </button>
        <button type="button" className="life-lightbox-zoom-btn fit" onClick={resetView}>
          Fit
        </button>
      </div>

      <div
        className={["life-lightbox-viewport", dragging ? "dragging" : "", scale > 1 ? "pannable" : ""].filter(Boolean).join(" ")}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <div
          className="life-lightbox-stage"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
        >
          <img
            className="life-lightbox-img"
            src={encodeURI(piece.full)}
            alt={piece.title}
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>

      <div className="life-lightbox-caption" onClick={(e) => e.stopPropagation()}>
        <span className="life-lightbox-medium">{piece.medium}</span>
        <span className="life-lightbox-name">{piece.title}</span>
        <span className="life-lightbox-hint">Click, scroll, or +/− to zoom · drag when zoomed · double-click to fit</span>
      </div>
    </div>
  );
}

function GalleryTile({
  piece,
  onOpen,
  gridColumn,
}: {
  piece: StudioPiece;
  onOpen: (piece: StudioPiece) => void;
  gridColumn?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(piece.thumb) && !imgFailed;

  return (
    <button
      type="button"
      className="life-gallery-item"
      style={gridColumn ? { gridColumn } : undefined}
      onClick={() => onOpen(piece)}
    >
      {showImage ? (
        <img
          className="life-gallery-img"
          src={encodeURI(piece.thumb)}
          alt={piece.title}
          loading="lazy"
          decoding="async"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="life-gallery-placeholder">
          <div className="life-gallery-placeholder-icon">{piece.placeholderIcon}</div>
          <div className="life-gallery-placeholder-label">
            {piece.placeholderLabel.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < piece.placeholderLabel.split("\n").length - 1 ? <br /> : null}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="life-gallery-overlay">
        <div className="life-gallery-medium">{piece.medium}</div>
        <div className="life-gallery-name">{piece.title}</div>
      </div>
    </button>
  );
}

export function LifeOutsideEngineeringSection() {
  const spotlightParts = spotlightCard.body.split(`"${spotlightCard.quote}"`);
  const pianoThumb = youtubeThumbnail(lifeLinks.pianoRecital);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const [ribbonHeight, setRibbonHeight] = useState<number | null>(null);
  const [lightboxPiece, setLightboxPiece] = useState<StudioPiece | null>(null);
  const stackLayout = useMemo(
    () => getStudioStackLayout(stackedPieces.length),
    [stackedPieces.length]
  );

  const openLightbox = useCallback((piece: StudioPiece) => {
    setLightboxPiece(piece);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxPiece(null);
  }, []);

  useEffect(() => {
    const el = ribbonRef.current;
    if (!el) return;
    const sync = () => setRibbonHeight(el.offsetHeight);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <section id="life" className="sec life-section">
      <SectionHeader number="06" title="Outside engineering" />
      <p className="life-sub serif">{lifeSectionIntro}</p>

      <div className="life-spotlight" ref={ribbonRef}>
        <div className="life-ribbon-cell life-ribbon-copy">
          <span className="life-spot-kicker">{spotlightCard.kicker}</span>
          <div className="life-spot-title">{spotlightCard.title}</div>
          <div className="life-spot-body serif">
            {spotlightParts[0]}
            <em>&ldquo;{spotlightCard.quote}&rdquo;</em>
            {spotlightParts[1]}
          </div>
        </div>

        <div className="life-ribbon-cell life-ribbon-media">
          <RibbonMedia
            href={lifeLinks.linkedInSpotlight}
            src={lifeMedia.spotlightThumbnail}
            alt="View Cornell spotlight on LinkedIn"
            fit="contain"
          />
        </div>

        <div className="life-ribbon-cell life-ribbon-copy">
          <div className="life-piano-stamp">
            <div className="life-piano-stamp-dot" />
            <span className="life-piano-stamp-text">{pianoCard.stamp}</span>
          </div>
          <div className="life-piano-title">{pianoCard.title}</div>
          <div className="life-piano-body serif">{pianoCard.body}</div>
          <span className="life-piano-piece">{pianoCard.piece}</span>
        </div>

        <div className="life-ribbon-cell life-ribbon-media">
          {pianoThumb ? (
            <RibbonMedia
              href={lifeLinks.pianoRecital}
              src={pianoThumb}
              alt="Watch piano recital recording"
              fit="cover"
            />
          ) : null}
        </div>
      </div>

      <div className="life-studio-header">
        <span className="life-studio-title">Studio — oils, pencil, pastel</span>
      </div>

      <div
        className="life-studio-gallery"
        style={ribbonHeight ? { height: ribbonHeight } : undefined}
      >
        <div className="life-studio-featured">
          <GalleryTile piece={featuredPiece} onOpen={openLightbox} />
        </div>
        <div
          className="life-studio-stack"
          style={{
            gridTemplateColumns: stackLayout.columns,
            gridTemplateRows: stackLayout.rows,
          }}
        >
          {stackedPieces.map((piece, index) => (
            <GalleryTile
              key={piece.id}
              piece={piece}
              onOpen={openLightbox}
              gridColumn={stackLayout.itemSpans?.[index]}
            />
          ))}
        </div>
      </div>

      <div className="life-thread">
        <span className="life-thread-label">{lifeThread.label}</span>
        <p className="life-thread-copy serif">{lifeThread.copy}</p>
      </div>

      {lightboxPiece ? <StudioLightbox piece={lightboxPiece} onClose={closeLightbox} /> : null}
    </section>
  );
}

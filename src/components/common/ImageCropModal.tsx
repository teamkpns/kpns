'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Modal, Button, Slider, message } from 'antd';
import {
  UploadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  RotateRightOutlined,
  UndoOutlined,
  CheckOutlined,
  CameraOutlined,
} from '@ant-design/icons';

interface ImageCropModalProps {
  open: boolean;
  onCancel: () => void;
  onCropComplete: (croppedDataUrl: string) => Promise<void> | void;
  loading?: boolean;
  aspectRatio?: '1:1' | '16:9';
  title?: string;
  submitText?: string;
}

export function ImageCropModal({
  open,
  onCancel,
  onCropComplete,
  loading = false,
  aspectRatio = '1:1',
  title,
  submitText,
}: ImageCropModalProps) {
  const is16by9 = aspectRatio === '16:9';

  // Sizing definitions
  const CANVAS_WIDTH = is16by9 ? 380 : 360;
  const CANVAS_HEIGHT = is16by9 ? 240 : 360;
  const CROP_WIDTH = is16by9 ? 320 : 280;
  const CROP_HEIGHT = is16by9 ? 180 : 280;
  const CROP_RADIUS = 140; // used for 1:1 circle

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Reset state when modal opens or closes
  useEffect(() => {
    if (!open) {
      setImageSrc(null);
      setImageLoaded(false);
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    }
  }, [open]);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      message.error('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      message.error('File size too large. Please select an image under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        setImageSrc(src);
        setImageLoaded(true);
        setZoom(1);
        setRotation(0);
        setOffset({ x: 0, y: 0 });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Draw on Canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    if (imageRef.current && imageLoaded) {
      const img = imageRef.current;

      ctx.save();
      ctx.translate(centerX + offset.x, centerY + offset.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Scale image to cover the crop box
      const baseScale = Math.max(
        CROP_WIDTH / img.width,
        CROP_HEIGHT / img.height
      );
      const drawWidth = img.width * baseScale;
      const drawHeight = img.height * baseScale;

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();
    }

    // Draw darkened mask outside the crop area
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';

    if (is16by9) {
      // Draw rectangular cutout mask
      const cropLeft = (CANVAS_WIDTH - CROP_WIDTH) / 2;
      const cropTop = (CANVAS_HEIGHT - CROP_HEIGHT) / 2;

      ctx.beginPath();
      // Outer full canvas clockwise
      ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      // Inner crop window counter-clockwise to form a cutout
      ctx.rect(cropLeft + CROP_WIDTH, cropTop, -CROP_WIDTH, CROP_HEIGHT);
      ctx.fill();

      // Draw dashed border around crop rectangle
      ctx.beginPath();
      ctx.rect(cropLeft, cropTop, CROP_WIDTH, CROP_HEIGHT);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();

      // Draw rule-of-thirds grid
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;

      // Vertical lines
      ctx.moveTo(cropLeft + CROP_WIDTH / 3, cropTop);
      ctx.lineTo(cropLeft + CROP_WIDTH / 3, cropTop + CROP_HEIGHT);
      ctx.moveTo(cropLeft + (CROP_WIDTH * 2) / 3, cropTop);
      ctx.lineTo(cropLeft + (CROP_WIDTH * 2) / 3, cropTop + CROP_HEIGHT);

      // Horizontal lines
      ctx.moveTo(cropLeft, cropTop + CROP_HEIGHT / 3);
      ctx.lineTo(cropLeft + CROP_WIDTH, cropTop + CROP_HEIGHT / 3);
      ctx.moveTo(cropLeft, cropTop + (CROP_HEIGHT * 2) / 3);
      ctx.lineTo(cropLeft + CROP_WIDTH, cropTop + (CROP_HEIGHT * 2) / 3);
      ctx.stroke();
    } else {
      // Circular crop for profile avatar (1:1)
      ctx.beginPath();
      ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.arc(centerX, centerY, CROP_RADIUS, 0, Math.PI * 2, true);
      ctx.fill();

      // Draw circular guideline border
      ctx.beginPath();
      ctx.arc(centerX, centerY, CROP_RADIUS, 0, Math.PI * 2);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 6]);
      ctx.stroke();

      // Center crosshair
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 10, centerY);
      ctx.lineTo(centerX + 10, centerY);
      ctx.moveTo(centerX, centerY - 10);
      ctx.lineTo(centerX, centerY + 10);
      ctx.stroke();
    }

    ctx.restore();
  }, [CANVAS_WIDTH, CANVAS_HEIGHT, CROP_WIDTH, CROP_HEIGHT, CROP_RADIUS, imageLoaded, is16by9, offset, rotation, zoom]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Mouse & Touch Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageLoaded) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!imageLoaded || e.touches.length === 0) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length === 0) return;
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Perform Final Crop Output
  const handleCropAndSubmit = async () => {
    if (!imageRef.current || !imageLoaded) {
      message.warning('Please select an image first.');
      return;
    }

    try {
      const outputCanvas = document.createElement('canvas');
      const OUTPUT_WIDTH = is16by9 ? 800 : 400;
      const OUTPUT_HEIGHT = is16by9 ? 450 : 400;
      outputCanvas.width = OUTPUT_WIDTH;
      outputCanvas.height = OUTPUT_HEIGHT;
      const ctx = outputCanvas.getContext('2d');
      if (!ctx) return;

      const img = imageRef.current;
      const scaleFactor = OUTPUT_WIDTH / CROP_WIDTH;

      // Fill with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);

      ctx.save();
      ctx.translate(OUTPUT_WIDTH / 2, OUTPUT_HEIGHT / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom * scaleFactor, zoom * scaleFactor);

      const baseScale = Math.max(
        CROP_WIDTH / img.width,
        CROP_HEIGHT / img.height
      );
      const drawWidth = img.width * baseScale;
      const drawHeight = img.height * baseScale;

      const offsetX = offset.x / zoom;
      const offsetY = offset.y / zoom;

      ctx.drawImage(
        img,
        -drawWidth / 2 + offsetX,
        -drawHeight / 2 + offsetY,
        drawWidth,
        drawHeight
      );
      ctx.restore();

      // Export as crisp, web-optimized JPEG (~40-60KB)
      const croppedDataUrl = outputCanvas.toDataURL('image/jpeg', 0.85);
      await onCropComplete(croppedDataUrl);
    } catch (err) {
      console.error('Crop error:', err);
      message.error('Failed to crop image. Please try again.');
    }
  };

  const modalTitle = title || (is16by9 ? 'Crop Activity Photo' : 'Change Profile Picture');
  const actionButtonText = submitText || (is16by9 ? 'Crop & Attach Photo' : 'Submit for Approval');

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <CameraOutlined className="text-[#3447AA]" />
          <span className="font-bold text-gray-900 text-base">{modalTitle}</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={CANVAS_WIDTH + 60}
      centered
      className="rounded-3xl overflow-hidden"
    >
      <div className="space-y-4 pt-2">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Canvas / Crop Area */}
        <div className="flex flex-col items-center justify-center">
          <div
            style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}
            className="relative bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-gray-200"
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`w-full h-full ${imageLoaded ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
            />

            {/* Prompt overlay if no image selected yet */}
            {!imageLoaded && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 text-white cursor-pointer hover:bg-slate-900/70 transition p-6 text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-2xl text-pink-200 border border-white/20">
                  <UploadOutlined />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">Click to Select Photo</p>
                  <p className="text-xs text-gray-300 mt-1">Supports JPG, PNG, WebP (Max 10MB)</p>
                </div>
                <Button
                  type="primary"
                  className="bg-[#3447AA] rounded-xl font-bold text-xs mt-1"
                >
                  Browse Device
                </Button>
              </div>
            )}
          </div>

          <p className="text-[11px] text-gray-400 mt-2 text-center">
            {imageLoaded
              ? `🖐️ Drag to adjust position within the ${is16by9 ? '16:9 banner' : 'circular'} crop frame`
              : is16by9
              ? 'Widescreen photo for activity post display on About & Home pages'
              : 'Official member identification photo for KPNS records'}
          </p>
        </div>

        {/* Controls (Only visible after image is loaded) */}
        {imageLoaded && (
          <div className="space-y-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3">
              <ZoomOutOutlined className="text-gray-400 text-xs" />
              <Slider
                min={0.8}
                max={3}
                step={0.05}
                value={zoom}
                onChange={setZoom}
                className="flex-1 my-0"
                tooltip={{ formatter: (val) => `${Math.round((val || 1) * 100)}%` }}
              />
              <ZoomInOutlined className="text-gray-400 text-xs" />
            </div>

            {/* Action buttons: Rotate, Reset, Change Image */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-200/60">
              <div className="flex items-center gap-2">
                <Button
                  size="small"
                  icon={<RotateRightOutlined />}
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="rounded-lg text-xs"
                >
                  Rotate 90°
                </Button>
                <Button
                  size="small"
                  icon={<UndoOutlined />}
                  onClick={() => {
                    setZoom(1);
                    setRotation(0);
                    setOffset({ x: 0, y: 0 });
                  }}
                  className="rounded-lg text-xs"
                >
                  Reset
                </Button>
              </div>

              <Button
                size="small"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg text-xs font-semibold text-[#3447AA] border-blue-200 hover:bg-blue-50"
              >
                Choose Other
              </Button>
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <Button onClick={onCancel} className="rounded-xl text-xs h-9 px-4">
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleCropAndSubmit}
            loading={loading}
            disabled={!imageLoaded}
            className="bg-[#3447AA] hover:bg-[#283887] rounded-xl font-bold text-xs h-9 px-5"
          >
            {actionButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

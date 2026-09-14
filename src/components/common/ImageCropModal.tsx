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
}

export function ImageCropModal({
  open,
  onCancel,
  onCropComplete,
  loading = false,
}: ImageCropModalProps) {
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

  const CANVAS_SIZE = 360;
  const CROP_RADIUS = 140; // 280px diameter circle for crop area

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

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (imageRef.current && imageLoaded) {
      const img = imageRef.current;
      const centerX = CANVAS_SIZE / 2;
      const centerY = CANVAS_SIZE / 2;

      ctx.save();
      ctx.translate(centerX + offset.x, centerY + offset.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Scale image to cover the crop circle
      const baseScale = Math.max(
        (CROP_RADIUS * 2) / img.width,
        (CROP_RADIUS * 2) / img.height
      );
      const drawWidth = img.width * baseScale;
      const drawHeight = img.height * baseScale;

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();
    }

    // Draw darkened mask outside the crop circle
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.beginPath();
    ctx.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CROP_RADIUS, 0, Math.PI * 2, true);
    ctx.fill();

    // Draw circular guideline border
    ctx.beginPath();
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CROP_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 6]);
    ctx.stroke();

    // Draw subtle crosshair in the center
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    const center = CANVAS_SIZE / 2;
    ctx.beginPath();
    ctx.moveTo(center - 10, center);
    ctx.lineTo(center + 10, center);
    ctx.moveTo(center, center - 10);
    ctx.lineTo(center, center + 10);
    ctx.stroke();

    ctx.restore();
  }, [imageLoaded, offset, rotation, zoom]);

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

  // Perform Final Crop Output (400x400 JPEG)
  const handleCropAndSubmit = async () => {
    if (!imageRef.current || !imageLoaded) {
      message.warning('Please select an image first.');
      return;
    }

    try {
      const outputCanvas = document.createElement('canvas');
      const OUTPUT_SIZE = 400;
      outputCanvas.width = OUTPUT_SIZE;
      outputCanvas.height = OUTPUT_SIZE;
      const ctx = outputCanvas.getContext('2d');
      if (!ctx) return;

      const img = imageRef.current;
      const scaleFactor = OUTPUT_SIZE / (CROP_RADIUS * 2);

      // Fill with clean background in case of transparent PNG
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      ctx.save();
      // Center on output canvas
      ctx.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom * scaleFactor, zoom * scaleFactor);

      const baseScale = Math.max(
        (CROP_RADIUS * 2) / img.width,
        (CROP_RADIUS * 2) / img.height
      );
      const drawWidth = img.width * baseScale;
      const drawHeight = img.height * baseScale;

      // Adjust offset by scaleFactor
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

      // Export as crisp, optimized JPEG (~35KB)
      const croppedDataUrl = outputCanvas.toDataURL('image/jpeg', 0.85);
      await onCropComplete(croppedDataUrl);
    } catch (err) {
      console.error('Crop error:', err);
      message.error('Failed to crop image. Please try again.');
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <CameraOutlined className="text-[#3447AA]" />
          <span className="font-bold text-gray-900 text-base">Change Profile Picture</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={440}
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
          <div className="relative w-[360px] h-[360px] bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
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
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl text-pink-200 border border-white/20">
                  <UploadOutlined />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">Click to Select Photo</p>
                  <p className="text-xs text-gray-300 mt-1">Supports JPG, PNG, WebP (Max 10MB)</p>
                </div>
                <Button
                  type="primary"
                  className="bg-[#3447AA] rounded-xl font-bold text-xs mt-2"
                >
                  Browse Device
                </Button>
              </div>
            )}
          </div>

          <p className="text-[11px] text-gray-400 mt-2 text-center">
            {imageLoaded
              ? '🖐️ Drag to adjust position within circular crop frame'
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
            Submit for Approval
          </Button>
        </div>
      </div>
    </Modal>
  );
}

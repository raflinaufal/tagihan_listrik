"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, UploadCloud } from 'lucide-react';

interface PelangganData {
  id_pelanggan: number;
  nama_pelanggan: string;
  alamat: string;
  nomor_kwh: string;
  foto_profil?: string;
}

export default function ProfilePage() {
  const [pelanggan, setPelanggan] = useState<PelangganData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/pelanggan/profile');
      if (response.ok) {
        const data = await response.json();
        setPelanggan(data);
        if (data.foto_profil) setPreviewUrl(data.foto_profil);
      }
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setSaving(true);
    const formData = new FormData();
    formData.append('foto', selectedFile);
    try {
      const response = await fetch('/api/pelanggan/profile/foto', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        fetchProfile();
        setSelectedFile(null);
      }
    } catch (error) {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-2 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Profil Pelanggan
          </CardTitle>
          <CardDescription>Kelola informasi dan foto profil Anda</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : pelanggan && (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-28 h-28 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Foto Profil" className="object-cover w-full h-full" />
                  ) : (
                    <User className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                >
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Pilih Foto
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={saving}
                    className="mt-2"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Foto'}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2 mt-6">
                <div className="bg-blue-50 rounded p-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{pelanggan.nama_pelanggan}</span>
                </div>
                <div className="bg-gray-50 rounded p-3 text-gray-700">Alamat: {pelanggan.alamat || '-'}</div>
                <div className="bg-green-50 rounded p-3 text-gray-700">No. KWH: {pelanggan.nomor_kwh}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, UploadCloud } from 'lucide-react';
import PelangganNav from '@/components/PelangganNav';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PelangganData {
  id_pelanggan: number;
  username: string;
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
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editNama, setEditNama] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (pelanggan) {
      setEditUsername(pelanggan.username || '');
      setEditNama(pelanggan.nama_pelanggan || '');
    }
  }, [pelanggan]);

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

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    if (!editNama || editNama.length < 3) {
      setAlert({ type: 'error', message: 'Nama pelanggan minimal 3 karakter' });
      return;
    }
    if (!editUsername || editUsername.length < 4) {
      setAlert({ type: 'error', message: 'Username minimal 4 karakter' });
      return;
    }
    if (editPassword && editPassword.length < 6) {
      setAlert({ type: 'error', message: 'Password minimal 6 karakter' });
      return;
    }
    setEditLoading(true);
    try {
      const res = await fetch('/api/pelanggan/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_pelanggan: editNama, username: editUsername, password: editPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: 'success', message: data.message || 'Profil berhasil diupdate' });
        setEditPassword('');
        fetchProfile();
      } else {
        setAlert({ type: 'error', message: data.error || 'Gagal update profil' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan' });
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      <PelangganNav />
      <div className="max-w-2xl mx-auto px-2 py-12">
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
                {/* Info Card */}
                <div className="grid grid-cols-1 gap-3 mt-6">
                  <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">{pelanggan.nama_pelanggan}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2 text-gray-700">
                    <span className="inline-block w-5 text-center">🏠</span>
                    <span>Alamat: {pelanggan.alamat || '-'}</span>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 flex items-center gap-2 text-gray-700">
                    <span className="inline-block w-5 text-center">🔌</span>
                    <span>No. KWH: {pelanggan.nomor_kwh}</span>
                  </div>
                </div>
                {/* Form Edit Username & Password */}
                <div className="mt-8">
                  {alert && (
                    <Alert variant={alert.type === 'success' ? 'success' : 'destructive'} className="mb-4">
                      <AlertTitle>{alert.type === 'success' ? 'Berhasil' : 'Gagal'}</AlertTitle>
                      <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleEditProfile} className="bg-white rounded-xl shadow p-5 space-y-5">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Nama Pelanggan</label>
                      <Input
                        value={editNama}
                        onChange={e => setEditNama(e.target.value)}
                        minLength={3}
                        required
                        placeholder="Nama Pelanggan"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Username</label>
                      <Input
                        value={editUsername}
                        onChange={e => setEditUsername(e.target.value)}
                        minLength={4}
                        required
                        placeholder="Username"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Password Baru <span className="font-normal text-xs text-gray-400">(opsional)</span></label>
                      <Input
                        type="password"
                        value={editPassword}
                        onChange={e => setEditPassword(e.target.value)}
                        minLength={0}
                        placeholder="Password baru"
                        className="h-11"
                      />
                      <span className="text-xs text-gray-400">Kosongkan jika tidak ingin mengganti password</span>
                    </div>
                    <Button type="submit" disabled={editLoading} className="w-full mt-2 h-11 text-base font-semibold">
                      {editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
} 
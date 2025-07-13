"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface Tarif {
  id_tarif: number;
  daya: number;
  tarifperkwh: number;
}

export default function TarifPage() {
  const [tarif, setTarif] = useState<Tarif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ daya: "", tarifperkwh: "" });
  const [formError, setFormError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarif, setEditTarif] = useState<Tarif | null>(null);
  const [editForm, setEditForm] = useState({ id_tarif: "", daya: "", tarifperkwh: "" });
  const [editFormError, setEditFormError] = useState("");
  const [tableAlert, setTableAlert] = useState("");
  const [tableAlertType, setTableAlertType] = useState<"success" | "error" | "warning">("success");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarifId, setDeleteTarifId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTarif();
  }, []);

  const fetchTarif = async () => {
    try {
      const response = await fetch("/api/tarif");
      if (response.ok) {
        const data = await response.json();
        setTarif(data);
      }
    } catch (error) {
      setError("Gagal memuat data tarif");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTarif = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setTableAlert("");
    if (!form.daya || !form.tarifperkwh) {
      setFormError("Semua field wajib diisi");
      return;
    }
    if (Number(form.daya) <= 0 || Number(form.tarifperkwh) <= 0) {
      setFormError("Daya dan tarif per kWh harus lebih dari 0");
      return;
    }
    try {
      const payload = { daya: Number(form.daya), tarifperkwh: Number(form.tarifperkwh) };
      const res = await fetch("/api/tarif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setTableAlertType("error");
        setTableAlert(data.message || data.error || "Gagal menambah tarif");
        return;
      }
      setTableAlertType("success");
      setTableAlert(data.message || "Tarif berhasil ditambahkan!");
      setShowAddModal(false);
      setForm({ daya: "", tarifperkwh: "" });
      setFormError("");
      await fetchTarif();
      setTimeout(() => setTableAlert(""), 3000);
    } catch (error) {
      setTableAlertType("error");
      setTableAlert("Terjadi kesalahan koneksi");
    }
  };

  const openEditModal = (tarif: Tarif) => {
    setEditTarif(tarif);
    setEditForm({
      id_tarif: tarif.id_tarif.toString(),
      daya: tarif.daya.toString(),
      tarifperkwh: tarif.tarifperkwh.toString(),
    });
    setEditFormError("");
    setShowEditModal(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditTarif = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditFormError("");
    setTableAlert("");
    if (!editForm.daya || !editForm.tarifperkwh) {
      setEditFormError("Semua field wajib diisi");
      return;
    }
    if (Number(editForm.daya) <= 0 || Number(editForm.tarifperkwh) <= 0) {
      setEditFormError("Daya dan tarif per kWh harus lebih dari 0");
      return;
    }
    try {
      const payload = {
        id_tarif: Number(editForm.id_tarif),
        daya: Number(editForm.daya),
        tarifperkwh: Number(editForm.tarifperkwh),
      };
      const res = await fetch("/api/tarif", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setTableAlertType("error");
        setTableAlert(data.message || data.error || "Gagal update tarif");
        return;
      }
      setTableAlertType("success");
      setTableAlert(data.message || "Tarif berhasil diupdate!");
      setShowEditModal(false);
      setEditTarif(null);
      setEditFormError("");
      await fetchTarif();
      setTimeout(() => setTableAlert(""), 3000);
    } catch (error) {
      setTableAlertType("error");
      setTableAlert("Terjadi kesalahan koneksi");
    }
  };

  const openDeleteModal = (id: number) => {
    setDeleteTarifId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteModalChange = (open: boolean) => {
    setShowDeleteModal(open);
    if (!open) {
      setDeleteTarifId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    setTableAlert("");
    try {
      const res = await fetch("/api/tarif", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_tarif: deleteTarifId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTableAlertType("error");
        setTableAlert(data.message || data.error || "Gagal menghapus tarif");
        return;
      }
      setTableAlertType("success");
      setTableAlert(data.message || "Tarif berhasil dihapus!");
      await fetchTarif();
      setShowDeleteModal(false);
      setTimeout(() => setTableAlert(""), 3000);
    } catch (error) {
      setTableAlertType("error");
      setTableAlert("Terjadi kesalahan koneksi");
    }
  };

  const getAlertVariant = () => {
    if (tableAlertType === "success") return "success";
    if (tableAlertType === "warning") return "warning";
    if (tableAlertType === "error") return "destructive";
    return undefined;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar onLogout={undefined} />
      <main className="flex-1 lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Tarif</h1>
            <p className="text-gray-600 mt-2">Kelola data tarif listrik (daya & tarif per kWh)</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {tableAlert && (
            <div className="mb-4">
              <Alert variant={getAlertVariant()}>
                <AlertDescription>{tableAlert}</AlertDescription>
              </Alert>
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Daftar Tarif</CardTitle>
                  <CardDescription>Data tarif listrik berdasarkan daya</CardDescription>
                </div>
                <Dialog open={showAddModal} onOpenChange={(open) => {
                  setShowAddModal(open);
                  if (!open) {
                    setFormError("");
                    setTableAlert("");
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setShowAddModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Tarif
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Tarif</DialogTitle>
                      <DialogDescription>Isi data tarif dengan benar.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddTarif}>
                      <div className="space-y-3">
                        {formError && <Alert variant="destructive"><AlertDescription>{formError}</AlertDescription></Alert>}
                        <Input name="daya" type="number" placeholder="Daya (VA)" value={form.daya} onChange={handleFormChange} required />
                        <Input name="tarifperkwh" type="number" placeholder="Tarif per kWh (Rp)" value={form.tarifperkwh} onChange={handleFormChange} required />
                      </div>
                      <DialogFooter className="mt-4">
                        <Button type="submit">Simpan</Button>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Batal</Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Daya (VA)</TableHead>
                        <TableHead className="font-semibold">Tarif per kWh (Rp)</TableHead>
                        <TableHead className="font-semibold">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tarif.map((item) => (
                        <TableRow key={item.id_tarif} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{item.daya.toLocaleString()}</TableCell>
                          <TableCell>{item.tarifperkwh.toLocaleString("id-ID")}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => openEditModal(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => openDeleteModal(item.id_tarif)} className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modal Edit Tarif */}
          <Dialog open={showEditModal} onOpenChange={(open) => {
            setShowEditModal(open);
            if (!open) {
              setEditFormError("");
              setTableAlert("");
            }
          }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Tarif</DialogTitle>
                <DialogDescription>Edit data tarif sesuai kebutuhan.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditTarif}>
                <div className="space-y-3">
                  {editFormError && <Alert variant="destructive"><AlertDescription>{editFormError}</AlertDescription></Alert>}
                  <Input name="daya" type="number" placeholder="Daya (VA)" value={editForm.daya} onChange={handleEditFormChange} required />
                  <Input name="tarifperkwh" type="number" placeholder="Tarif per kWh (Rp)" value={editForm.tarifperkwh} onChange={handleEditFormChange} required />
                </div>
                <DialogFooter className="mt-4">
                  <Button type="submit">Simpan</Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Batal</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Modal Konfirmasi Hapus */}
          <Dialog open={showDeleteModal} onOpenChange={handleDeleteModalChange}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hapus Tarif</DialogTitle>
                <DialogDescription>Konfirmasi penghapusan data tarif. Tindakan ini tidak dapat dibatalkan.</DialogDescription>
              </DialogHeader>
              <div className="mb-4">Apakah Anda yakin ingin menghapus data tarif ini? Tindakan ini tidak dapat dibatalkan.</div>
              <DialogFooter>
                <Button variant="destructive" onClick={handleDeleteConfirm}>Hapus</Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Batal</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
} 
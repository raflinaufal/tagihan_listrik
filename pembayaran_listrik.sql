-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 12, 2025 at 07:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pembayaran_listrik`
--

-- --------------------------------------------------------

--
-- Table structure for table `level`
--

CREATE TABLE `level` (
  `id_level` int(11) NOT NULL,
  `nama_level` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `level`
--

INSERT INTO `level` (`id_level`, `nama_level`) VALUES
(1, 'Reguler'),
(2, 'Premium'),
(3, 'Bisnis');

-- --------------------------------------------------------

--
-- Table structure for table `pelanggan`
--

CREATE TABLE `pelanggan` (
  `id_pelanggan` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nomor_kwh` varchar(20) NOT NULL,
  `nama_pelanggan` varchar(100) DEFAULT NULL,
  `alamat` varchar(191) DEFAULT NULL,
  `id_tarif` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pelanggan`
--

INSERT INTO `pelanggan` (`id_pelanggan`, `username`, `password`, `nomor_kwh`, `nama_pelanggan`, `alamat`, `id_tarif`) VALUES
(1, 'john_doe', 'f4ad231214cb99a985dff0f056a36242', '12345678901', 'John Doe', 'Jl. Sudirman No. 123, Jakarta', 1),
(2, 'jane_smith', 'f4ad231214cb99a985dff0f056a36242', '12345678902', 'Jane Smith', 'Jl. Thamrin No. 456, Jakarta', 2);

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran`
--

CREATE TABLE `pembayaran` (
  `id_pembayaran` int(11) NOT NULL,
  `id_tagihan` int(11) DEFAULT NULL,
  `id_pelanggan` int(11) DEFAULT NULL,
  `tanggal_pembayaran` datetime(3) DEFAULT NULL,
  `bulan_bayar` varchar(10) DEFAULT NULL,
  `biaya_admin` decimal(10,2) DEFAULT NULL,
  `total_bayar` decimal(10,2) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pembayaran`
--

INSERT INTO `pembayaran` (`id_pembayaran`, `id_tagihan`, `id_pelanggan`, `tanggal_pembayaran`, `bulan_bayar`, `biaya_admin`, `total_bayar`, `id_user`) VALUES
(1, 1, 1, '2025-07-12 17:28:48.463', 'Februari', 2500.00, 120124.00, 1),
(2, 3, 1, '2025-07-12 17:28:48.465', 'Maret', 2500.00, 133644.00, 1),
(3, 4, 2, '2025-07-12 17:28:48.468', 'Maret', 2500.00, 159332.00, 1),
(4, 5, 1, '2025-07-12 17:28:48.470', 'April', 2500.00, 144460.00, 1),
(5, 6, 2, '2025-07-12 17:28:48.472', 'April', 2500.00, 125532.00, 1),
(6, 8, 2, '2025-07-12 17:28:48.473', 'Mei', 2500.00, 132292.00, 1),
(7, 9, 1, '2025-07-12 17:28:48.475', 'Juni', 2500.00, 136348.00, 1),
(8, 12, 2, '2025-07-12 17:28:48.477', 'Juli', 2500.00, 143108.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `penggunaan`
--

CREATE TABLE `penggunaan` (
  `id_penggunaan` int(11) NOT NULL,
  `id_pelanggan` int(11) DEFAULT NULL,
  `bulan` varchar(10) NOT NULL,
  `tahun` year(4) NOT NULL,
  `meter_awal` int(11) NOT NULL,
  `meter_ahir` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `penggunaan`
--

INSERT INTO `penggunaan` (`id_penggunaan`, `id_pelanggan`, `bulan`, `tahun`, `meter_awal`, `meter_ahir`) VALUES
(1, 1, 'Februari', '2025', 1500, 1587),
(2, 2, 'Februari', '2025', 1550, 1656),
(3, 1, 'Maret', '2025', 1400, 1497),
(4, 2, 'Maret', '2025', 1450, 1566),
(5, 1, 'April', '2025', 1300, 1405),
(6, 2, 'April', '2025', 1350, 1441),
(7, 1, 'Mei', '2025', 1200, 1318),
(8, 2, 'Mei', '2025', 1250, 1346),
(9, 1, 'Juni', '2025', 1100, 1199),
(10, 2, 'Juni', '2025', 1150, 1244),
(11, 1, 'Juli', '2025', 1000, 1103),
(12, 2, 'Juli', '2025', 1050, 1154);

-- --------------------------------------------------------

--
-- Table structure for table `tagihan`
--

CREATE TABLE `tagihan` (
  `id_tagihan` int(11) NOT NULL,
  `id_penggunaan` int(11) DEFAULT NULL,
  `id_pelanggan` int(11) DEFAULT NULL,
  `bulan` varchar(10) NOT NULL,
  `tahun` year(4) NOT NULL,
  `jumlah_meter` int(11) NOT NULL,
  `status` enum('belum_bayar','sudah_bayar') NOT NULL DEFAULT 'belum_bayar'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tagihan`
--

INSERT INTO `tagihan` (`id_tagihan`, `id_penggunaan`, `id_pelanggan`, `bulan`, `tahun`, `jumlah_meter`, `status`) VALUES
(1, 1, 1, 'Februari', '2025', 87, 'sudah_bayar'),
(2, 2, 2, 'Februari', '2025', 106, 'belum_bayar'),
(3, 3, 1, 'Maret', '2025', 97, 'sudah_bayar'),
(4, 4, 2, 'Maret', '2025', 116, 'sudah_bayar'),
(5, 5, 1, 'April', '2025', 105, 'sudah_bayar'),
(6, 6, 2, 'April', '2025', 91, 'sudah_bayar'),
(7, 7, 1, 'Mei', '2025', 118, 'belum_bayar'),
(8, 8, 2, 'Mei', '2025', 96, 'sudah_bayar'),
(9, 9, 1, 'Juni', '2025', 99, 'sudah_bayar'),
(10, 10, 2, 'Juni', '2025', 94, 'belum_bayar'),
(11, 11, 1, 'Juli', '2025', 103, 'belum_bayar'),
(12, 12, 2, 'Juli', '2025', 104, 'sudah_bayar');

-- --------------------------------------------------------

--
-- Table structure for table `tarif`
--

CREATE TABLE `tarif` (
  `id_tarif` int(11) NOT NULL,
  `daya` int(11) NOT NULL,
  `tarifperkwh` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tarif`
--

INSERT INTO `tarif` (`id_tarif`, `daya`, `tarifperkwh`) VALUES
(1, 900, 1352.00),
(2, 1300, 1444.70),
(3, 2200, 1699.53);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama_admin` varchar(100) DEFAULT NULL,
  `id_level` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `username`, `password`, `nama_admin`, `id_level`) VALUES
(1, 'admin', '0192023a7bbd73250516f069df18b500', 'Administrator', 1),
(2, 'petugas', '570c396b3fc856eceb8aa7357f32af1a', 'Petugas PLN', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `level`
--
ALTER TABLE `level`
  ADD PRIMARY KEY (`id_level`);

--
-- Indexes for table `pelanggan`
--
ALTER TABLE `pelanggan`
  ADD PRIMARY KEY (`id_pelanggan`),
  ADD UNIQUE KEY `pelanggan_username_key` (`username`),
  ADD UNIQUE KEY `pelanggan_nomor_kwh_key` (`nomor_kwh`),
  ADD KEY `pelanggan_id_tarif_fkey` (`id_tarif`);

--
-- Indexes for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id_pembayaran`),
  ADD KEY `pembayaran_id_tagihan_fkey` (`id_tagihan`),
  ADD KEY `pembayaran_id_pelanggan_fkey` (`id_pelanggan`),
  ADD KEY `pembayaran_id_user_fkey` (`id_user`);

--
-- Indexes for table `penggunaan`
--
ALTER TABLE `penggunaan`
  ADD PRIMARY KEY (`id_penggunaan`),
  ADD KEY `penggunaan_id_pelanggan_fkey` (`id_pelanggan`);

--
-- Indexes for table `tagihan`
--
ALTER TABLE `tagihan`
  ADD PRIMARY KEY (`id_tagihan`),
  ADD KEY `tagihan_id_penggunaan_fkey` (`id_penggunaan`),
  ADD KEY `tagihan_id_pelanggan_fkey` (`id_pelanggan`);

--
-- Indexes for table `tarif`
--
ALTER TABLE `tarif`
  ADD PRIMARY KEY (`id_tarif`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `user_username_key` (`username`),
  ADD KEY `user_id_level_fkey` (`id_level`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `level`
--
ALTER TABLE `level`
  MODIFY `id_level` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pelanggan`
--
ALTER TABLE `pelanggan`
  MODIFY `id_pelanggan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id_pembayaran` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `penggunaan`
--
ALTER TABLE `penggunaan`
  MODIFY `id_penggunaan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tagihan`
--
ALTER TABLE `tagihan`
  MODIFY `id_tagihan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tarif`
--
ALTER TABLE `tarif`
  MODIFY `id_tarif` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `pelanggan`
--
ALTER TABLE `pelanggan`
  ADD CONSTRAINT `pelanggan_id_tarif_fkey` FOREIGN KEY (`id_tarif`) REFERENCES `tarif` (`id_tarif`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD CONSTRAINT `pembayaran_id_pelanggan_fkey` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan` (`id_pelanggan`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `pembayaran_id_tagihan_fkey` FOREIGN KEY (`id_tagihan`) REFERENCES `tagihan` (`id_tagihan`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `pembayaran_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `penggunaan`
--
ALTER TABLE `penggunaan`
  ADD CONSTRAINT `penggunaan_id_pelanggan_fkey` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan` (`id_pelanggan`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `tagihan`
--
ALTER TABLE `tagihan`
  ADD CONSTRAINT `tagihan_id_pelanggan_fkey` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan` (`id_pelanggan`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tagihan_id_penggunaan_fkey` FOREIGN KEY (`id_penggunaan`) REFERENCES `penggunaan` (`id_penggunaan`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_id_level_fkey` FOREIGN KEY (`id_level`) REFERENCES `level` (`id_level`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

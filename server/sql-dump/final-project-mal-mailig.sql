-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 07, 2024 at 02:41 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `final-project-mal-mailig`
--

-- --------------------------------------------------------

--
-- Table structure for table `anime`
--

CREATE TABLE `anime` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `score` decimal(3,1) DEFAULT NULL,
  `synopsis` text DEFAULT NULL,
  `coverPhoto` varchar(500) DEFAULT NULL,
  `popularity` decimal(10,2) DEFAULT NULL,
  `releaseDate` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `genres` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`genres`)),
  `number_of_episodes` int(11) DEFAULT NULL,
  `number_of_seasons` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `anime`
--

INSERT INTO `anime` (`id`, `title`, `score`, `synopsis`, `coverPhoto`, `popularity`, `releaseDate`, `created_at`, `genres`, `number_of_episodes`, `number_of_seasons`, `status`, `date_created`, `date_updated`) VALUES
(174, 'Death Note 2', 8.6, 'Light Yagami is an ace student with great prospects—and he’s bored out of his mind. But all that changes when he finds the Death Note, a notebook dropped by a rogue Shinigami death god. Any human whose name is written in the notebook dies, and Light has vowed to use the power of the Death Note to rid the world of evil. But will Light succeed in his noble goal, or will the Death Note turn him into the very thing he fights against?', 'https://image.tmdb.org/t/p/original/tCZFfYTIwrR7n94J6G14Y4hAFU6.jpg', 96.71, '2006-10-04', '2024-12-07 07:59:10', '[\"Animation\",\"Mystery\",\"Sci-Fi & Fantasy\"]', 37, 1, 'Ended', '2024-12-07 07:59:10', '2024-12-07 10:07:22'),
(175, 'Dan Da Dan 5', 8.8, 'In a bet to prove whether ghosts or aliens exist, two high schoolers face terrifying paranormal threats, gain superpowers and maybe even fall in love?!', 'https://image.tmdb.org/t/p/original/6qfZAOEUFIrbUH3JvePclx1nXzz.jpg', 989.67, '2024-10-04', '2024-12-07 08:35:34', '[\"Animation\",\"Action & Adventure\",\"Comedy\",\"Sci-Fi & Fantasy\"]', 12, 1, 'Returning Series', '2024-12-07 08:35:34', '2024-12-07 10:28:14'),
(179, 'Dragon Ball Z', 8.3, 'The adventures of Earth\'s martial arts defender, Son Goku, continue with a new family and the revelation of his alien origins. Now Goku and his allies must defend the planet from an onslaught of new extraterrestrial enemies.', 'https://image.tmdb.org/t/p/original/6VKOfL6ihwTiB5Vibq6QTfzhxA6.jpg', 326.76, '1989-04-26', '2024-12-07 09:32:01', '[\"Animation\",\"Sci-Fi & Fantasy\",\"Action & Adventure\"]', 291, 9, 'Ended', '2024-12-07 09:32:01', '2024-12-07 09:32:01'),
(180, 'Kaguya-sama: Love Is War', 8.6, 'Considered a genius due to having the highest grades in the country, Miyuki Shirogane leads the prestigious Shuchiin Academy\'s student council as its president, working alongside the beautiful and wealthy vice president Kaguya Shinomiya. The two are often regarded as the perfect couple by students despite them not being in any sort of romantic relationship.', 'https://image.tmdb.org/t/p/original/5khbC6AuNgnvnoDbjIMKCOhEtIc.jpg', 105.74, '2019-01-12', '2024-12-07 09:33:29', '[\"Animation\",\"Comedy\"]', 37, 3, 'Returning Series', '2024-12-07 09:33:29', '2024-12-07 09:33:29');

-- --------------------------------------------------------

--
-- Table structure for table `cast`
--

CREATE TABLE `cast` (
  `id` int(11) NOT NULL,
  `anime_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `character` varchar(255) DEFAULT NULL,
  `profile_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cast`
--

INSERT INTO `cast` (`id`, `anime_id`, `name`, `character`, `profile_path`) VALUES
(869, 179, 'Masako Nozawa 2', 'Son Goku / Son Gohan / Son Goten (voice)', '/jxbXdejmPoiKnNoQz7Dkb80qC26.jpg'),
(870, 179, 'Megumi Urawa', 'Erasa (voice)', NULL),
(871, 179, 'Shigeru Nakahara', 'Android 17 (voice)', '/b1Yup2dGpo1LeOzgfbcvtd3IF41.jpg'),
(872, 180, 'Makoto Furukawa', 'Miyuki Shirogane (voice)', '/inLmBZhrqXeE9wlViyK28ocKJSw.jpg'),
(873, 180, 'Konomi Kohara', 'Chika Fujiwara (voice)', '/3SA4eE579Fqex1qpMPcF4bTRFyT.jpg'),
(874, 180, 'Aoi Koga', 'Kaguya Shinomiya (voice)', '/uVpwheVV4aPROyY1toYv3v5HSPD.jpg'),
(875, 180, 'Ryota Suzuki', 'Yuu Ishigami (voice)', '/4Xq18mQttuW2yfRCflnWoU7UqQ5.jpg'),
(876, 180, 'Miyu Tomita', 'Miko Iino (voice)', '/rSR17l4HdchLkhpRuAZbGbXNmUS.jpg'),
(877, 180, 'Yumiri Hanamori', 'Ai Hayasaka (voice)', '/zXVwGxsxwEvL1f6wxzTYtxytjDn.jpg'),
(878, 180, 'Momo Asakura', 'Nagisa Kashiwagi (voice)', '/aAIedtsMhjdaUUOP6qi5sqMMS4X.jpg'),
(879, 180, 'Rina Hidaka', 'Kobachi Osaragi (voice)', '/7JupZGvqcq4dRxiTKpPxzg8NUS4.jpg'),
(880, 180, 'Taku Yashiro', 'Tsubasa Tanuma (voice)', '/eVdB6myaNJ4h38UU9hHHlsaCWHn.jpg'),
(881, 180, 'Kana Ichinose', 'Maki Shijou (voice)', '/3MmHWf5pa1i4s64T2mI6npc26TY.jpg'),
(882, 180, 'Haruka Fukuhara', 'Tsubame Koyasu (voice)', '/vTosH8FMDuQK9u6CWavOPnNdmH1.jpg'),
(883, 180, 'Yutaka Aoyama', 'Narration (voice)', '/uURpUJDPpDDABdXG0x9TYPxQknX.jpg'),
(884, 174, 'Mamoru Miyano2 ', 'Light Yagami (voice)', '/i8n9U3JlujjyPmiZPHGkpwxkh7X.jpg'),
(885, 174, 'Shido Nakamura', 'Ryuk (voice)', '/5cKT5ZDLyfEuZycVu7kLRDuMRPE.jpg'),
(886, 174, 'Kimiko Saito', 'Rem (voice)', '/rPP0jCjtLuEEroY3e2aRT8zonYK.jpg'),
(887, 175, 'Shion Wakayama 2', 'Momo Ayase (voice)', '/b697ggFreuliEfl4TjLgxhJCQXr.jpg'),
(888, 175, 'Mayumi Tanaka', 'Turbo Granny (voice)', '/by4t1tYtEXsfbFj9TvOjozBmQla.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `crew`
--

CREATE TABLE `crew` (
  `id` int(11) NOT NULL,
  `anime_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `job` varchar(255) DEFAULT NULL,
  `profile_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crew`
--

INSERT INTO `crew` (`id`, `anime_id`, `name`, `job`, `profile_path`) VALUES
(4658, 179, 'Katsuyoshi Nakatsuru 2', 'Character Designer', NULL),
(4659, 179, 'Takao Koyama', 'Series Composition', NULL),
(4660, 180, 'Norifumi Kugai', 'Opening/Ending Animation', NULL),
(4661, 180, 'Yuki Ito', 'Opening/Ending Animation', NULL),
(4662, 180, 'Takumi Miura', 'Opening/Ending Animation', NULL),
(4663, 180, 'Keisuke Kobayashi', 'Opening/Ending Animation', '/jhI7ckKtBSm6mtQU9SKXX3XF3sz.jpg'),
(4664, 180, 'Kimiya Nobukawa', 'Assistant Director of Photography', NULL),
(4665, 180, 'Hisaya Takahara', 'Special Effects', NULL),
(4666, 180, 'Nichika Ono', 'Opening/Ending Animation', NULL),
(4667, 180, 'Junichi Saito', 'Opening/Ending Animation', NULL),
(4668, 180, 'Hiroshi Yakou', 'Opening/Ending Animation', NULL),
(4669, 180, 'Mamoru Hatakeyama', 'Opening/Ending Animation', NULL),
(4670, 180, 'Genki Negishi', 'Producer', NULL),
(4671, 180, 'Ryota Aikei', 'Opening/Ending Animation', NULL),
(4672, 180, 'Aoi Otani', 'Opening/Ending Animation', NULL),
(4673, 180, 'Keiki Nishida', 'Music Director', NULL),
(4674, 180, 'Mikihiro Takayama', 'Associate Producer', NULL),
(4675, 180, 'Shinnosuke Ota', 'Opening/Ending Animation', NULL),
(4676, 180, 'Hayato Kakita', 'Opening/Ending Animation', NULL),
(4677, 180, 'Yu Saito', 'Opening/Ending Animation', NULL),
(4678, 180, 'Sumire Yoshida', 'Theme Song Performance', NULL),
(4679, 180, 'Kaito Hashimoto', 'Opening/Ending Animation', NULL),
(4680, 180, 'Reina Kawasaki', 'Opening/Ending Animation', NULL),
(4681, 180, 'Shuntaro Yamada', 'Opening/Ending Animation', NULL),
(4682, 180, 'Honoka Yokoyama', 'Opening/Ending Animation', NULL),
(4683, 180, 'Takuro Naka', 'Opening/Ending Animation', NULL),
(4684, 180, 'Meiko Uenoyama', 'Opening/Ending Animation', NULL),
(4685, 180, 'Shinobu Nishioka', 'Opening/Ending Animation', NULL),
(4686, 180, 'Marina Kobayashi', 'Opening/Ending Animation', NULL),
(4687, 180, 'Miharu Nagano', 'Opening/Ending Animation', NULL),
(4688, 180, 'Eiko Hirayama', 'Opening/Ending Animation', NULL),
(4689, 180, 'Ayaka Murakami', 'Color Assistant', NULL),
(4690, 180, 'Kiya Hirayoshi', 'Art Designer', NULL),
(4691, 180, 'Airi Suzuki', 'Theme Song Performance', '/vxkmgiewSEnzYDWQnIo963DoXT9.jpg'),
(4692, 180, 'Yuko Yahiro', 'Character Designer', NULL),
(4693, 180, 'Kimitaka Shindo', 'Sound Mixer', NULL),
(4694, 180, 'Yasuhiro Nakanishi', 'Series Composition', NULL),
(4695, 180, 'Jin Aketagawa', 'Sound Director', NULL),
(4696, 180, 'Rie Matsubara', 'Editor', NULL),
(4697, 180, 'Toshiya Wada', 'Sound Effects', NULL),
(4698, 180, 'Mamoru Hatakeyama', 'Series Director', NULL),
(4699, 180, 'Tatsuya Ishikawa', 'Producer', NULL),
(4700, 180, 'Taku Funakoshi', 'Producer', NULL),
(4701, 180, 'Toshihiro Maeda', 'Producer', '/uEKRPogU0Z1Lbgy3NWoxeTqX41T.jpg'),
(4702, 180, 'Akane Shiraishi', 'Assistant Editor', NULL),
(4703, 180, 'Takayuki Kidou', 'Prop Designer', NULL),
(4704, 180, 'Risa Wakabayashi', 'Art Direction', NULL),
(4705, 180, 'Kanako Hokari', 'Color Designer', NULL),
(4706, 180, 'Masayuki Suzuki', 'Theme Song Performance', '/pZpDyKqeg9eoKkpt55Rqojm7Rr7.jpg'),
(4707, 180, 'Hiroki Matsumoto', 'Art Designer', NULL),
(4708, 180, 'Masaharu Okazaki', 'Director of Photography', '/2HBJUkGuDvjsHyz9qi1IdbLXrnC.jpg'),
(4709, 180, 'Kei Haneoka', 'Original Music Composer', NULL),
(4710, 180, 'Aka Akasaka', 'Comic Book', NULL),
(4711, 180, 'Masaharu Yamanouchi', 'Music Producer', '/zvUJh1vW61OqOYyhirjjJ7GOg5p.jpg'),
(4712, 180, 'Yuki Kuribayashi', 'CGI Director', NULL),
(4713, 174, 'Manabu Tamura 2', 'Producer', NULL),
(4714, 174, 'Tomohiko Ito', 'Assistant Director', '/GyFpjtodiP19QlMue8Yu41N3gG.jpg'),
(4715, 174, 'Aya Hida', 'Editor', NULL),
(4716, 174, 'Kazuhiro Yamada', 'Director of Photography', NULL),
(4717, 174, 'Tetsuro Araki', 'Series Director', '/oEdiTbFLMJDSGUSDe8a48VbueGJ.jpg'),
(4718, 174, 'Takeshi Obata', 'Comic Book', NULL),
(4719, 174, 'Takahiro Kagami', 'Supervising Animation Director', NULL),
(4720, 174, 'Tsugumi Ohba', 'Comic Book', NULL),
(4721, 174, 'Satoshi Hashimoto', 'Color Designer', NULL),
(4722, 174, 'Hideki Taniuchi', 'Original Music Composer', NULL),
(4723, 174, 'Yoshihisa Hirano', 'Original Music Composer', NULL),
(4724, 174, 'Shinji Sugiyama', 'Art Designer', NULL),
(4725, 174, 'Shoji Hata', 'Sound Mixer', '/koKRAUGvvNFMaH62NNdp4iHYAyt.jpg'),
(4726, 174, 'Masaru Kitao', 'Supervising Animation Director', NULL),
(4727, 175, 'Hiroshi Seko 2', 'Series Composition', '/zdTUsjMPFEZhygVdKs5rABtHJyk.jpg'),
(4728, 175, 'Seiki Tamura', 'Art Designer', NULL),
(4729, 175, 'Abel Góngora', 'Opening/Ending Animation', '/jZU8NupOBAFriwaZ2uHDFYNkq1O.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `photos`
--

CREATE TABLE `photos` (
  `id` int(11) NOT NULL,
  `anime_id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `photos`
--

INSERT INTO `photos` (`id`, `anime_id`, `url`) VALUES
(1193, 179, 'https://image.tmdb.org/t/p/original/s9xZojg7pNDv26hzvi0Lgt5esWC.jpg'),
(1194, 179, 'https://image.tmdb.org/t/p/original/iARVC4xBe40OEgYcnLNoOerS2mb.jpg'),
(1195, 179, 'https://image.tmdb.org/t/p/original/6DAMfO6VDcRF9hZ7XyaW6IsvOUG.jpg'),
(1196, 180, 'https://image.tmdb.org/t/p/original/dJ8yrSokdTMnhKJw06MllSfCegb.jpg'),
(1197, 180, 'https://image.tmdb.org/t/p/original/y1nea0aZ2W7weK6ij6cEpVPPpvX.jpg'),
(1198, 180, 'https://image.tmdb.org/t/p/original/tNyNbNWvaw4Dul1lRcYIXyADCuU.jpg'),
(1199, 180, 'https://image.tmdb.org/t/p/original/iyjJL6zPCa8QAtsarKICstaYTFx.jpg'),
(1200, 180, 'https://image.tmdb.org/t/p/original/acFjVL56t9tlTx2hgllemsGqgEU.jpg'),
(1201, 180, 'https://image.tmdb.org/t/p/original/dGxFF0CvKGgxVYtEaOrzTE5Fx0N.jpg'),
(1202, 180, 'https://image.tmdb.org/t/p/original/9QpiUgxXl4m6HjRDmiy48CjfjSp.jpg'),
(1203, 180, 'https://image.tmdb.org/t/p/original/7jaNJnJxZHFX1qTZafWdKkMY9nL.jpg'),
(1204, 180, 'https://image.tmdb.org/t/p/original/o4kcgjy3HEs7hFOBdsLa0ze2n9O.jpg'),
(1205, 180, 'https://image.tmdb.org/t/p/original/kmTDenBvzy2Xhxts6LiC1pONalw.jpg'),
(1206, 174, 'https://image.tmdb.org/t/p/original/2Yfzm5857lprGonYPl30XgEpTry.jpg'),
(1207, 174, 'https://image.tmdb.org/t/p/original/mOlEbXcb6ufRJKogI35KqsSlCfB.jpg'),
(1208, 174, 'https://image.tmdb.org/t/p/original/cImgYbMpDbvsEdnUSa0tXj4O1wf.jpg'),
(1209, 174, 'https://image.tmdb.org/t/p/original/mRwV4W2BAEpte7xlawJP4fsBpmS.jpg'),
(1210, 174, 'https://image.tmdb.org/t/p/original/3IqZkiolIli6yEfq3JYsnm3se00.jpg'),
(1211, 174, 'https://image.tmdb.org/t/p/original/3hLizkVeYxy9taUpOpeoxDNxDQN.jpg'),
(1212, 175, 'https://image.tmdb.org/t/p/original/zEEJNFTTD2Z9AQVcMUWy4Hjp05k.jpg'),
(1213, 175, 'https://image.tmdb.org/t/p/original/jlbUx0aHJupDVDlCo0R7UxSaUUd.jpg'),
(1214, 175, 'https://image.tmdb.org/t/p/original/aXWqrD4sTT0RZ3ete18AfCSeTgS.jpg'),
(1215, 175, 'https://image.tmdb.org/t/p/original/itNnXiIIUtOOGfNaGSdjsP634ar.jpg'),
(1216, 175, 'https://image.tmdb.org/t/p/original/aAqBfOli8MEnC4G0Nf0ykot5YtJ.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'user',
  `favorites` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`favorites`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `first_name`, `last_name`, `middle_name`, `contact_no`, `role`, `favorites`) VALUES
(1, 'Goyong', '$2y$10$bB46PQkThbkggnaJKWpubuZXePXuclJT6hYlIqoKy3A6YFA1nMN4a', 'Juan ', 'Dela Cruz', 'P', '123123124123', 'admin', NULL),
(2, 'Lancelot', '$2y$10$jkVBvCPHYklWrZPwGMJzreZ3zxDZSqW2yujTDWfpTdxWq.p1.GrM2', 'Jan Lancelot', 'Mailig', 'Pineda', '09694597701', 'admin', '[174,175]'),
(3, 'User', '$2y$10$vQHACdEWEm0xWOsGFWe12uRoKEn9B/9wd/NLywHM4bjv1fBe4reZq', 'Jan Lancelot', 'Mailig', 'P', '09694597701', 'user', NULL),
(4, 'GoyongJuan', '$2y$10$yUWRTvb.O08oNxsjiCzL6elYZQb1nr/rGGXj0kZBNh0PyeBYr8Md.', 'Jan Lancelot', 'Mailig', 'P.', '09694597701', 'admin', '[175]');

-- --------------------------------------------------------

--
-- Table structure for table `user_ratings`
--

CREATE TABLE `user_ratings` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `animeId` int(11) NOT NULL,
  `rating` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_ratings`
--

INSERT INTO `user_ratings` (`id`, `userId`, `animeId`, `rating`) VALUES
(12, 2, 174, 10),
(13, 2, 175, 10),
(14, 4, 175, 10);

-- --------------------------------------------------------

--
-- Table structure for table `user_reviews`
--

CREATE TABLE `user_reviews` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `animeId` int(11) NOT NULL,
  `reviewText` text DEFAULT NULL,
  `reviewDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_reviews`
--

INSERT INTO `user_reviews` (`id`, `userId`, `animeId`, `reviewText`, `reviewDate`) VALUES
(13, 2, 174, 'Hello?', '2024-12-07 01:27:48'),
(14, 4, 174, 'Good', '2024-12-07 03:43:01');

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `anime_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `key` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `anime_id`, `name`, `key`) VALUES
(551, 179, 'Opening 2 | WE GOTTA POWER - Hironobu Kageyama [35mm Film Scan]', 'Lc2zmS_0p0o'),
(552, 179, 'Opening 1 V2 | CHA-LA-HEAD-CHA-LA - Hironobu Kageyama [Creditless]', 'ElqB359i_Os'),
(553, 180, 'Love Is War? Opening | DADDY! DADDY! DO! - Masayuki Suzuki feat. Airi Suzuki', 'lTlzDfhPtFA'),
(554, 180, 'Trailer [Subtitled]', 'rZ95aZmQu_8'),
(555, 180, 'Official Trailer [Subtitled]', 'X0A5hFLAPak'),
(556, 174, 'Official Trailer', 'NlJZ-YgAt-c'),
(557, 175, 'Dub Trailer', '6Kj1hc54nu0'),
(558, 175, 'Official Trailer [Subtitled]', 'NRxTXed7I7k');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anime`
--
ALTER TABLE `anime`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cast`
--
ALTER TABLE `cast`
  ADD PRIMARY KEY (`id`),
  ADD KEY `anime_id` (`anime_id`);

--
-- Indexes for table `crew`
--
ALTER TABLE `crew`
  ADD PRIMARY KEY (`id`),
  ADD KEY `anime_id` (`anime_id`);

--
-- Indexes for table `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `anime_id` (`anime_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_ratings`
--
ALTER TABLE `user_ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_rating` (`userId`,`animeId`),
  ADD KEY `user_ratings_ibfk_2` (`animeId`);

--
-- Indexes for table `user_reviews`
--
ALTER TABLE `user_reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_review` (`userId`,`animeId`),
  ADD KEY `user_reviews_ibfk_2` (`animeId`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `anime_id` (`anime_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anime`
--
ALTER TABLE `anime`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- AUTO_INCREMENT for table `cast`
--
ALTER TABLE `cast`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=889;

--
-- AUTO_INCREMENT for table `crew`
--
ALTER TABLE `crew`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4730;

--
-- AUTO_INCREMENT for table `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1217;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_ratings`
--
ALTER TABLE `user_ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `user_reviews`
--
ALTER TABLE `user_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=559;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cast`
--
ALTER TABLE `cast`
  ADD CONSTRAINT `cast_ibfk_1` FOREIGN KEY (`anime_id`) REFERENCES `anime` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `crew`
--
ALTER TABLE `crew`
  ADD CONSTRAINT `crew_ibfk_1` FOREIGN KEY (`anime_id`) REFERENCES `anime` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `photos`
--
ALTER TABLE `photos`
  ADD CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`anime_id`) REFERENCES `anime` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_ratings`
--
ALTER TABLE `user_ratings`
  ADD CONSTRAINT `user_ratings_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_ratings_ibfk_2` FOREIGN KEY (`animeId`) REFERENCES `anime` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_reviews`
--
ALTER TABLE `user_reviews`
  ADD CONSTRAINT `user_reviews_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_reviews_ibfk_2` FOREIGN KEY (`animeId`) REFERENCES `anime` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`anime_id`) REFERENCES `anime` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

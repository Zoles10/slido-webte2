-- phpMyAdmin SQL Dump
-- version 5.2.1deb1+jammy2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 13, 2024 at 06:21 PM
-- Server version: 8.0.36-0ubuntu0.22.04.1
-- PHP Version: 8.3.3-1+ubuntu22.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `slido`
--

-- --------------------------------------------------------

--
-- Table structure for table `Answer`
--

CREATE TABLE `Answer` (
  `answer_id` int NOT NULL,
  `question_id` int NOT NULL,
  `answer_string` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` int DEFAULT NULL,
  `answered_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Answer`
--

INSERT INTO `Answer` (`answer_id`, `question_id`, `answer_string`, `user_id`, `answered_at`) VALUES
(33, 10, 'white;blue;red;gray', NULL, '2024-05-08 06:44:43'),
(34, 10, 'red;blue', NULL, '2024-05-08 07:01:55'),
(35, 10, 'red;blue;white;gray', NULL, '2024-05-08 07:21:12'),
(37, 10, 'blue', NULL, '2024-05-08 08:56:38'),
(38, 10, 'red', NULL, '2024-05-08 09:00:51'),
(40, 10, 'red', NULL, '2024-05-08 09:08:02'),
(42, 10, 'blue', NULL, '2024-05-08 09:50:57'),
(44, 10, 'red;blue;white', NULL, '2024-05-08 13:13:27'),
(45, 12, 'test', NULL, '2024-05-09 12:39:42'),
(46, 11, 'test', NULL, '2024-05-09 13:56:05'),
(47, 11, '21', NULL, '2024-05-09 13:56:12'),
(48, 11, 'test', NULL, '2024-05-09 14:17:53'),
(49, 11, 'testik', NULL, '2024-05-09 14:17:59'),
(50, 22, '@a', NULL, '2024-05-09 14:42:24'),
(51, 22, 'sd', NULL, '2024-05-09 14:42:28'),
(52, 22, '1A', NULL, '2024-05-09 14:42:31'),
(53, 22, '@a', NULL, '2024-05-09 14:42:33'),
(54, 22, '', NULL, '2024-05-09 14:42:37'),
(55, 10, 'red', NULL, '2024-05-11 07:41:19'),
(56, 10, 'red;blue;white;gray', NULL, '2024-05-11 09:16:40'),
(57, 10, 'red;gray', NULL, '2024-05-11 09:17:01'),
(58, 10, 'red;blue;white;gray', NULL, '2024-05-11 09:21:14'),
(59, 12, 'ano', NULL, '2024-05-11 09:28:45'),
(60, 10, 'red;blue;white;gray', NULL, '2024-05-11 10:26:59'),
(61, 32, '', NULL, '2024-05-11 11:51:04'),
(62, 33, 'ANO', NULL, '2024-05-11 13:00:32'),
(63, 33, 'NEE', NULL, '2024-05-11 13:00:43'),
(64, 33, 'ANO', NULL, '2024-05-11 13:00:49'),
(65, 33, 'ANO', NULL, '2024-05-11 13:00:57'),
(66, 33, '', NULL, '2024-05-11 13:01:05'),
(67, 33, 'ANO', NULL, '2024-05-11 13:01:11'),
(68, 34, '30cm', NULL, '2024-05-11 13:06:58'),
(69, 34, '37cm', NULL, '2024-05-11 13:07:13'),
(70, 34, '37cm', NULL, '2024-05-11 13:07:20'),
(71, 34, '4.3cm', NULL, '2024-05-11 13:07:29'),
(72, 34, '37cm', NULL, '2024-05-11 13:09:48'),
(73, 34, '37cm', NULL, '2024-05-11 13:11:16'),
(74, 33, 'ANO', NULL, '2024-05-11 13:20:35'),
(75, 34, '17cm', NULL, '2024-05-11 13:20:55'),
(76, 34, '37cm', NULL, '2024-05-11 13:21:23'),
(77, 34, '37cm', NULL, '2024-05-11 13:28:19'),
(78, 34, '22cm', NULL, '2024-05-11 13:28:29'),
(79, 34, '37cm', NULL, '2024-05-11 13:28:45'),
(80, 34, '22cm', NULL, '2024-05-11 13:28:53'),
(81, 34, '11cm', NULL, '2024-05-11 13:29:01'),
(82, 10, 'red', NULL, '2024-05-11 16:13:12'),
(83, 10, 'red;blue', NULL, '2024-05-11 16:36:51'),
(84, 11, 'Lebo je fasa', NULL, '2024-05-11 17:08:36'),
(85, 10, 'green', NULL, '2024-05-13 13:30:27');

-- --------------------------------------------------------

--
-- Table structure for table `ArchivedQuestion`
--

CREATE TABLE `ArchivedQuestion` (
  `archived_question_id` int NOT NULL,
  `question_id` int NOT NULL,
  `code` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `from` timestamp NOT NULL,
  `to` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ArchivedQuestion`
--

INSERT INTO `ArchivedQuestion` (`archived_question_id`, `question_id`, `code`, `note`, `from`, `to`) VALUES
(1, 10, '71368', NULL, '2024-05-07 15:00:09', '2024-05-11 07:11:05'),
(2, 10, '71368', NULL, '2024-05-11 07:40:19', '2024-05-11 07:42:31'),
(3, 10, '71368', NULL, '2024-05-11 08:09:27', '2024-05-11 09:17:23'),
(4, 10, '71368', NULL, '2024-05-11 09:17:26', '2024-05-11 09:21:27'),
(5, 33, '17807', NULL, '2024-05-11 11:25:07', '2024-05-11 12:03:36'),
(6, 33, '17807', NULL, '2024-05-11 12:59:29', '2024-05-11 13:02:44'),
(7, 34, '64075', NULL, '2024-05-11 13:03:50', '2024-05-11 13:21:09'),
(8, 10, '71368', '5th poll', '2024-05-11 14:25:19', '2024-05-11 14:25:27');

-- --------------------------------------------------------

--
-- Table structure for table `Question`
--

CREATE TABLE `Question` (
  `question_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  `question_string` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `question_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `active` tinyint(1) NOT NULL,
  `topic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `currentVoteStart` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Question`
--

INSERT INTO `Question` (`question_id`, `created_at`, `user_id`, `question_string`, `question_type`, `active`, `topic`, `code`, `currentVoteStart`) VALUES
(10, '2024-05-07 15:00:09', 3, 'What is the color of my shirt rn?', 'multiple_choice', 1, 'test', '71368', '2024-05-11 14:30:23'),
(11, '2024-05-08 09:51:30', 4, 'Preco volit Smer ? ', 'open_end', 1, 'Politika', '92383', '2024-05-08 09:51:30'),
(12, '2024-05-08 10:41:04', 4, 'ako sa mas', 'open_end', 1, 'ak47', '53255', '2024-05-08 10:41:04'),
(13, '2024-05-08 11:15:30', 4, 'Si teply ? ', 'multiple_choice', 1, 'Prieskum kamosov', '9793', '2024-05-08 11:15:30'),
(14, '2024-05-08 11:22:06', 3, 'Ako sa mas?', 'open_end', 1, 'test', '216', '2024-05-08 11:22:06'),
(15, '2024-05-08 11:27:11', 3, 'ddasasddasadads', 'open_end', 1, 'saasddas', '39818', '2024-05-11 06:28:38'),
(16, '2024-05-08 11:29:00', 3, 'assasdsadsadas', 'open_end', 1, 'dsaasddsa', '62307', '2024-05-11 06:28:38'),
(17, '2024-05-08 11:30:21', 3, 'addfdsfsfd', 'open_end', 1, 'dfsfdsdf', '27194', '2024-05-11 06:28:38'),
(18, '2024-05-08 11:30:31', 3, 'dfsdfsdfsdf', 'open_end', 1, 'sdfsfds', '48026', '2024-05-11 06:28:38'),
(19, '2024-05-08 11:41:25', 3, 'adsadasdasd', 'open_end', 1, 'dsadsdas', '271', '2024-05-11 06:28:38'),
(20, '2024-05-08 11:41:55', 3, 'asdasddsasdas', 'open_end', 1, 'dasasdads', '1982', '2024-05-11 06:28:38'),
(21, '2024-05-09 13:51:25', 3, 'sdasddas', 'open_end', 0, 'adsdasd', '20677', '2024-05-11 06:28:38'),
(22, '2024-05-09 14:41:42', 4, 'Test multi', 'multiple_choice', 1, 'test', '87440', '2024-05-11 06:28:38'),
(28, '2024-05-09 16:35:10', 10, 'sadassad', 'open_end', 0, 'adsasd', '13422', '2024-05-11 06:28:38'),
(29, '2024-05-11 11:19:56', 0, 'Test', 'multiple_choice', 1, 'Tes', '44184', '2024-05-11 11:19:56'),
(30, '2024-05-11 11:21:06', 0, 'asdasd', 'multiple_choice', 1, 'das', '63146', '2024-05-11 11:21:06'),
(31, '2024-05-11 11:22:37', 3, 'test', 'multiple_choice', 1, 'dsa', '94625', '2024-05-11 11:22:37'),
(32, '2024-05-11 11:24:17', 0, 'TESTING', 'multiple_choice', 1, 'YES', '32188', '2024-05-11 11:24:17'),
(33, '2024-05-11 11:25:07', 3, 'TEsTING', 'multiple_choice', 1, 'asd', '17807', '2024-05-11 13:02:47'),
(34, '2024-05-11 13:03:50', 3, 'Aky velky mas penis', 'open_end', 1, 'penis', '64075', '2024-05-11 13:21:15'),
(210, '2024-05-11 14:00:14', 3, 'What is the color of my shirt rn?', 'multiple_choice', 1, 'test', '85727', '2024-05-11 14:00:14'),
(211, '2024-05-13 13:20:05', 3, 'ukazka', 'open_end', 1, 'ukazka', '69675', '2024-05-13 13:20:05');

-- --------------------------------------------------------

--
-- Table structure for table `QuestionOption`
--

CREATE TABLE `QuestionOption` (
  `question_option_id` int NOT NULL,
  `question_id` int NOT NULL,
  `option_string` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `correct` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `QuestionOption`
--

INSERT INTO `QuestionOption` (`question_option_id`, `question_id`, `option_string`, `correct`) VALUES
(2, 10, 'green', 0),
(3, 10, 'blue', 1),
(4, 10, 'white', 0),
(5, 10, 'gray', 1),
(6, 22, '1A', 0),
(7, 22, '@a', 0),
(8, 22, '', 0),
(9, 22, 'sd', 0),
(14, 33, 'ANO', 1),
(16, 33, 'NEE', 0),
(17, 210, 'red', 0),
(18, 210, 'ok', 1),
(19, 210, 'white', 0),
(20, 210, 'gray', 1);

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `user_id`, `token`, `expires_at`) VALUES
(174, 3, 'ac9655045e27dddc60ce4a8dd44fce7da90955b106bfb7e74c20ca5e51d3bc3b95f32f79c23923611ba86e8ddfe4d8426ce3429577a0b56297defac2ec76ec8d', '2024-05-16 16:18:47'),
(175, 3, 'e653909a4dceda0f1c8a355f9f19bd0164a9931d2ca122191f6c485876e973ce929c344e8b2bec4ab152a806e2d04a0228bc7cce701a67878f84e519f2f11893', '2024-05-16 16:19:54'),
(176, 3, '184d99892efc7b5d066abed489615060ed44243be5678b270c7a82312028a450d9d753ee1adb6e664906d31c1017a62d211e44f9f38ec72207bf217c7a177219', '2024-05-16 16:20:19'),
(177, 3, '1a1bf4e8c6dc2fe39d910dd8ef2b19b522cfca56b590e3cd27c8a46134b43722fcdb7c563fa5dd0531ab4b8c45f09350a07906c434fdcb7de929170f9634852d', '2024-05-16 16:21:28'),
(178, 3, '764adfd4901707d40c1b0b4f405073eb34dbf9fd1c60629eee9643642288cae5cb35763f949125296249bacefa0d10c6a97655e092ec3efc6a1ecd771df51b05', '2024-05-16 16:26:35'),
(179, 3, 'ac42ce8086b2bc9d5bd698047c387faed4685cdf73e5f6b5831d812064e1a678b57c1d79bddedb18139ada4e2073a0645c4833bb6fcc261d0815ab4055f96dee', '2024-05-16 16:29:47'),
(180, 3, '4f5565f3217a3d62db29069d671b3ed911e8a38feb5d04d90f4457173cafb4a376e22888f4bae009b6787b48adf74751c62205ce10eef2233358a782d43e9adf', '2024-05-16 16:30:00'),
(181, 3, '4f054d7a11a3318bc80c7cb5a930a6633da849b4a7fa95c22c430d8d594b538ed581d98e05a7ceb1687f8626c4c92946462bf652fb235267b4070642adbacb81', '2024-05-16 16:32:14'),
(182, 3, '20da78b45e939f9a2f3cf512ae859333a8da0f59da937532e31ea1d465a687b77bac5a5fca6f18e52c2322b1bd755ab129b786d4e0bc2c9b33b02abef5bda947', '2024-05-16 16:33:01'),
(183, 3, 'c3c434d9fe4597e4e77f7f7e05dfaa2ae2651be92db32d7ef7862ae7fca4e4701752153dce66ecc1e320f4a83725e47db114a81f9dd02193a4755574efb3ba0a', '2024-05-16 16:34:12'),
(184, 3, '8930999b7cc68acfeca72f00c1a48b767e639bc8bc73cb87b3f5434c1a5c29fbb14b47c3debf82ecfcc49c88eb0725436cea2b74a412a24238d1c6cc3a27abdb', '2024-05-16 16:35:00'),
(185, 3, '6f4797fc324e9d426c99804586c43b4425329dde2137a564e88a9b36dd1d2189f9c9a796d49d078c5f81cee9ad30b1c935e02d744f7898fdfbac76f7d77799f4', '2024-05-16 16:35:57'),
(186, 3, '5787f64c10a1e5a3db43ee9e4fdefc354593548c39224c6622dffb79a65b368a4d5156f0870632e1ada863ca5ebc6d3c80370319377da2f67a816f6249249aac', '2024-05-16 16:36:32'),
(187, 3, '333d8125c76b6126536f19f4366517df8e756c072420800d94cf5c0073f61e7957433a365730c341d79cabd841dd1bd9f527ae2c8b342c39d5aa88f608382e0f', '2024-05-16 17:13:40'),
(188, 3, '46dffa744b5c6d0ad43b7e3b74bae6f442b204d9e3c782a440b2fd022d1adfb71ea06d482c2a552aa2aec39df5a2ca3ff9d76ecca522b1900837e196f932bf62', '2024-05-17 16:36:17'),
(189, 3, '4792d28736027d476e2b042bfc1efb732c63b5a13dd53f614c20ac097335e1941e678b0be221b87695b6b476149efd468e2314f2e832cd793aa5126ce20c8a5c', '2024-05-17 16:38:57'),
(190, 3, '8f3ed4d32f5f934ed912fa08d4097fa710e8ef32477cfc56765fe8c10b276c0e11ca35f9ff3e3accae510515f294b6d227b6247e334133ec33ad5aef4b786cc6', '2024-05-17 16:40:28'),
(191, 3, '81ee2a010a775edf76c3d474367c910d71fd354f5be8aebdb877377d15cd1cf47adb38a4e771cd5f06f45f9064bf3a7493c0300ae967196d78c3586d380cd5ce', '2024-05-17 16:57:13'),
(192, 3, '0520fd1f9be4a9b675e34214a17f30480d41ea73a8621dc9aeffffbb8771e311936db17e2568dd2d303e449e737b1be2dfd05d220d8b6c64be663dc99e9113ac', '2024-05-17 16:57:16'),
(193, 3, '1f80eaf5772e7784c30b7392881337e3da567f0b28f79b032fe6f16cdd84bd00293a7f39f67d27cc0fa13d9d001372c5a2799ecc8a27d479b5e71b15763686c3', '2024-05-17 17:13:19'),
(194, 3, '90acd619dad0be50a800ebefacba71413ddf0ebe244636fa46d8fb29514a62f8ec4d0e654b94c651774c549af5e4e55f62b775351342f4a8172bf1ce443e4102', '2024-05-18 07:00:32'),
(195, 3, '615e41e6291f1fa5db5b5c516baa796a246242c7126a64eeac851833db86b8f15bb464e7040e085f08c3f6fa1d7f4d18a6500eeaed5f89ee8b2b2277e48e1065', '2024-05-18 07:02:54'),
(196, 3, '45229020275bca09dbed9318072ba256c41e73fb533a3a2e92f35867dbd14cea9feb8a111f34d731453abeecca169a5f0066a95e6aff70882d522c34fdb8425f', '2024-05-18 07:30:11'),
(197, 3, 'ff92a13051c4a921fc90e138cedecb9c8f24a996ca3f8e19ae0e66292e7e8ebb3c702acf19f210085cb0256188713a6766ec5b3f14e3ab08966f3e5a11c66ef9', '2024-05-18 07:41:08'),
(198, 3, '2615b01445df5eabbc713de1f992104a510c3aef845edc493ae129fab9a9c232c9983e671e5d99153ad111f10e89a386bb13526e1461fb82b86e6303aa276fdc', '2024-05-18 08:09:03'),
(199, 3, 'c78c74036a3bf13ebd7b9be263613bc403fcbd4696661a1ef8feeb0a39ec776f974a40d67277f7efcd7550de8fffd2e76f32086876f80c41c803363eba3acf50', '2024-05-18 08:09:38'),
(200, 3, 'f10e640c2eb0e3f3d7aade96ccbde86c8f84f777e4df23e85308261b68f365669b7294827c967280e375fa2ec3eb43aaef0be4fb55011247883dab0090e079e2', '2024-05-18 08:39:18'),
(201, 3, '34fede084770305228e419dfedb895378d5ee6c367b6320a0e033f615337a0513c7f7e7396ad3fef3021c37c5eda69cb2f9290d84d187fb7b57016dbaf1908fe', '2024-05-18 09:16:16'),
(202, 3, 'fda87d29bafb53891aea5c6a0fa8bd07b5750aea3568b459847b3b2236c96aa357d84df6595bacc2e8662b086e17535c12fc9ad980c03cf10ef5fb74d728dd01', '2024-05-18 09:16:55'),
(203, 3, '27a646d3a0507e7b0766e72f1281eea4e0eea2f301ceb95c036f83e54e071e3d8751a95ae04174e744e682f44f92cb935d084bda09187a9e1d1bbfbb808513a3', '2024-05-18 09:17:15'),
(204, 3, '30f4df70d031040b80db637a9dcb8031617c48f3e5bf0557a9fe6ad8281f708d6fc8e33dc6f66c6616d79578a2a159c00a06adfa7a54df5a2878250c71d6fb36', '2024-05-18 09:21:02'),
(205, 3, '4b97fe2ec9d38192c7160827cca8f3391c32b8d065a908ffaf1914414c495ebc8a1ad83f2bfdaa500342f1697213e343f849e35ab80f1ad9f631149591654b3e', '2024-05-18 09:21:41'),
(206, 4, '1d082d8fc6eaad27e5ada4ad6a13eea5bc1845c9822edc62c127deb95cf4ea249181f551c61b19ed695275c2ebb6a26417ebea8be54ebe6b10c9b24c39819088', '2024-05-18 09:39:13'),
(207, 4, 'ebb27ad788ffb9e9da512c14c7b4a2fcbdd47ebd39689f4377c188f6f7872936db36dd1584c3a4d0e5d53ace4bcf04d6660530b8482a48004bf826bf6f7d77af', '2024-05-18 09:41:38'),
(208, 4, '962a6d42176d216dc6c0e1e935bb0ebe8be3ef716cb4176343b32bba36fc9c13d24e650229e5614f1d51d360160654bcc6fc6e434e0588104715f243ef82d410', '2024-05-18 09:51:48'),
(209, 4, 'f785e8517bee0727148071b5a57132099dd4f4c36c42e324fe56b70af43eebfd0b93a2d103f27e370675301d6401b3d22a916536ba829f203f9dfe905d0d49ee', '2024-05-18 09:53:24'),
(210, 4, 'e3d9f803150d7579be7ac8f159babf1bb11fdd03a9385650b72e771b7bf8465f9ed8e34eeb651289d2efc8290119fd551d330819dbcbf14fc49050b8547e1beb', '2024-05-18 09:53:39'),
(211, 4, '5fd8e0f160ed65a12a8de9e1eb561fbe31ad3d6ef5a5dc25ca0132066fc5f08a3e99c0f749e69c97611461f6809aeaf7aec95239f4caf0e4a45d1b81ef8a0a9f', '2024-05-18 09:54:48'),
(212, 4, 'a701272aba0702dbd2d6405748193bd10548982d70de34b0b41af1cb2a7a90087d9f80807c4724b9797c8c3ee91af98f70e7e41b7de75bf9f116a110b7936372', '2024-05-18 09:55:01'),
(213, 4, '38f72cd08665235f6207c3e7909531797b03ffe266f0da6abb815f4828723e1978f28a7884b9045cbf31fa381ccdbfaa3e2047f1e549c915f33ad2bece2f9af3', '2024-05-18 10:00:36'),
(214, 4, '99ea228a111883a0acea1a87ac36b0d7fce758aa366d203a95368bdc7c9b3d2b2994bbc9b9031d66a55c7a91339f443dec41943cba8717ba590002946ffc5246', '2024-05-18 10:02:11'),
(215, 4, '549ab4a1f9aa2ca6ca4f23ea177f47998ef7bf21feb9f3b36962ea969c0a91f72554da6a0dbe960c5999ed35b72c98a0f2a7bec090bb06480de86a152cebeebc', '2024-05-18 10:02:20'),
(216, 4, '4f3b35d0a2172e4c2f7aef64718eebada1824c1191a523bd2af772151b130bed892f023a0182a446ffc93ed3cd396759cd8710a0e4f6901ab97bae90294c1ddd', '2024-05-18 10:09:44'),
(217, 4, 'ce8db466bd13ba75809d575b9ddc0614451e5ba4385f3f4c88cb89010768f7c0bbac2bd93bbd5e8414e7a8080967526c333fa4f319000bb233584c57f929582f', '2024-05-18 10:10:52'),
(218, 4, '047815ec7721e437c6a17c30748735a819f9c7adf4755906a4ebb40467b66725b3158aa0012b42c73ab791541b8caa9173a862958eedb72401de3627ae147662', '2024-05-18 10:14:49'),
(219, 4, 'a23a6d65d1eee30c6c97f132fb4adb88557cd384aa90cf59281477ba08d873b89e721489578498ab97a18f3b81d08d69326d8658dd52dc1dea1ef5dddc243fa8', '2024-05-18 10:15:27'),
(220, 4, 'fe4362f95eeeca24d09b324c55ecd8c4d14a9ec89c8e3305591a14aaf7f4450f1853c4d16a4a6427715ad01e65f640e7e7d4e50f1bf2f5a995297aa945170b60', '2024-05-18 10:15:47'),
(221, 4, '5ac6d7b306ac69a659f26b44e6e766c1e189643c2ce61ccdad09e6af16216e2cf0b6cdbd3cc03bf9f55ad05de42b2bfea24ba6e13fe89ce484011d86f05d6832', '2024-05-18 10:16:12'),
(222, 4, 'ffa2b2dd3d18a30ad7cbeacfa68444352539504bf1004c71ca1d53fa80fe392b34f3e18f94c6b09fa116126470c494b57f64b7d5ec22ac19a27afaa6daa186ee', '2024-05-18 10:16:19'),
(223, 4, 'e7afecec2430f37d29104ae0084fd742c99a584c32442dc93b670344f46f414aae5c7da3b2b96a64d4834339f6b2cf36a2873fc464c364574128cf25e196536a', '2024-05-18 10:16:27'),
(224, 3, '17e3c490ebcb27125295b79ca7cee43792a951a8532ed0e520fa218083029f277082555e2bfe7f86d917021d0225841170bad61db99b91efcf023b516209e1b7', '2024-05-18 10:19:48'),
(225, 3, '61566dd73efdcbe9140cfb5595d48fefd8935f5484505f601b4fe546d745ff5918beabc06d1956fafe12675796c053ca11e22efaa169231367207b0fc9c71081', '2024-05-18 10:26:50'),
(226, 3, '90f6086b3b3af1bee0ea380a9ff8c68db84ad5a0ae2a49060fae67aa960cf83a5cb36235516683195ca585d496538caefbd9da1b8e25c68b242274a74575871d', '2024-05-18 11:51:11'),
(227, 3, 'd90d72bcb2de555ae3bd9b469f9b6dc931294d97d4e22de42a075857b0a531d02f1815b3427465381d11d2e46458b864ea987a72f5d99b3677d564ae71a62d1b', '2024-05-18 12:36:09'),
(228, 3, '9f2c0569f6769e528ce98cb7254e56a2a225c5f106c6d8417abc719e1e940c29cf43037bf19fc0fe8cfab944c3532ef9c8945c3b2bd28a70dcee32ad4ba546d7', '2024-05-18 13:02:07'),
(229, 3, 'ca4607b4ba89a6ef84a3fea159beaf9a97f6c26c07b177ef36df93b0f232a868c0942b0dd6fa6045c1bee80bba23536bd945629dc57c45e7b9567a1caadebc19', '2024-05-18 13:06:40'),
(230, 3, 'a502879e728cf2674eaf013972fad1cda766ec6ef175b5bd1bcf5b464b9dc80d5128e1f50d9bd44cc5716fb4b5b9924f552d3919c8d91a1545e09fc2edb89c03', '2024-05-18 13:41:06'),
(231, 3, '69e0e14d3943e92340cd1d7287c8881cad1e8de7409baba881940b78c677d54c549a1afdbb27c0f33b540a89e9094f112cb71fa4478714cade9bcfe2f2cba45e', '2024-05-18 13:42:06'),
(232, 3, '814fbcefa11bc7146fc8c4d5c4b93da057b1f47389d3018a9cbb241edcef77380cbdeef6838d2e59e64d9c4486d63a9ec232523e533b631228728c5127fc95f8', '2024-05-18 13:51:46'),
(233, 3, 'f5d3b7e5b977d5bd71d87b24e8d92d5290d05c23915c440b110e72c39dbe14388956dce2f8e559e4140e45d7ccb372ef34a569bc7d766b4a6e44b9e622bc4ccc', '2024-05-18 13:52:50'),
(234, 3, 'ff7b1dd13040c218dd430cf9fe73f9b27af026b4dcf17fa15c99a25d2738635f196eab18af87b1502ae54b63cf7abfdf6a85fd7643f5e23c0c5f6f5afdacb17c', '2024-05-18 13:59:46'),
(235, 3, '9dffc49748dfa5746c7bba478b05193a6cee909ecbbb8f2bf7ef9ff6731f1a4e9c87c8ae2996743446c1aa45a501ef82619eaba3a96c15961c4a06fa843f8488', '2024-05-18 14:01:06'),
(236, 3, 'ef86ef901853a43a0e9c29bdd329cdf64a599ed17fd0f6c216e35037062743a4c86bb0fbf097ca51eef88cf67f578b1425850b2f6b1e10ea3cfb27df0003c429', '2024-05-18 14:41:59'),
(237, 3, '1ee491364cdc3cc83ff869405c2310fc9bd2d24c4f073fc2d5bec542d8d325e9f4b59530a6442d56b591c16abf9c096db2d0e67b954fa6bb08e52eb20e7d4ae0', '2024-05-18 17:07:01'),
(238, 3, '4b4d33d9c4b87b03e22537636f4557a22dc9b1e9367fe33333d3af404f54ee4864aedd8a13ed383ffa87a74ecb34ad6bc7516da28fa73c0e57765ac814e4ac81', '2024-05-18 17:35:50'),
(239, 3, '5bc0c687f134d3ff7fead1fd18504160b38624f31794f35762c0b5f0d82f14e88eafe9709955f5ddc0a98ab127b4753e3a1e8367ed9ce537fa0d18911c8f00d5', '2024-05-18 17:38:57'),
(240, 3, 'f16d60497df89d5883a710af47df6f9ce46285bfb1b411574e31a1f7402c40fa46389ef0411d93165a3d8054025849d8077400696e1fede23a41472e18cb7ad6', '2024-05-18 20:27:31'),
(241, 3, '58746fcfe940a142fe384f555922150ec0640546f9b0fc87180f4d654a8d28a819038ad3041fb518dcea624c5f05fdc4b4fda7649c81fb22dad01101077ac148', '2024-05-19 11:33:40'),
(242, 3, '561927ef6d4202b790278d5bcc3a31a3a9ad7e03562e5dad3c8783614afebabab965d136e421a03b816818eb6c4b88b3d1f58684316d5d4a853d3201cbdd8c9a', '2024-05-20 13:13:36'),
(243, 3, '41e385c14eb08042af9e27b916994c1cd603b7bde31501104ff2c60d480f691e89c3fb349d1f175d18549f3abac7a15496622efd3839dd81e15479f8829ccd1b', '2024-05-20 13:14:40'),
(244, 3, 'a354ece9476946cd34c12698472218c2a1198648f9787d79f09532e5ac57707584cda295123b44eaeebee71f4c3169680506bd689ab8bd9ba767efcc9bb8522a', '2024-05-20 13:18:17'),
(245, 3, '8fb523d574377a5cf920fabb4a803f556fd45d4eedf93bd219c9bd561d9481ac5b42ed455255cd7516dcccb974393e2838167c4903eec88ed2ec0c697fe01381', '2024-05-20 13:19:20'),
(246, 17, 'f059c38278dd6a7375730d51b6a99693d99ccc929e2ece2ccc187811b328636dbfed469416dcc58830c84449f72bc5273dd200ce12d48b3f3e9ce45b4598621b', '2024-05-20 13:23:02'),
(247, 3, '80939eb4d849cba8a33de8772ef5c21ed630ecea687bd0f8c492ab79ff2a129f7697b0dbe66afe928a7725b1f52b90907d336c47f0952ad2c5db464049b402b1', '2024-05-20 13:30:46'),
(248, 10, '9297f5ddbd929c095b0dae12b5532e154521476e83b9effb94d7f9d71698ff5c17b6eb39cd660c53df0c63403604cf594fe6c690366d64bdd71e8e073fe843d3', '2024-05-20 13:31:18');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `user_id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`user_id`, `email`, `password`, `name`, `lastname`, `created_at`, `role`) VALUES
(3, 'zoltan.raffay10@gmail.com', '$2y$10$gc4O4XDJD38kiDxjrLOkr.7C0D3SCLPHH6UJuigUkoGkVFJHDDc0G', 'aaaaaaa', 'Raffay', '2024-05-09 16:17:06', 'admin'),
(4, 'viktormaaly6@gmail.com', '$2y$10$iqsR8ILEl/gTyTnM/ayLnuRVPAZM6aRNSVlg4I5IkmRsZ5fQutl.6', 'Viktor', 'Mali', NULL, 'user'),
(10, 'martin.vidlicka@gmail.com', '$2y$10$uvCMMm8DqooS2yADV.SI5OL9pvxNK6Z39jMY8yEOvbHOXBMe9X.7i', 'Martin', 'Vidlicka', '2024-05-08 09:46:00', 'user'),
(17, 'vidlicka.vladimir@gmail.com', '$2y$10$rTCnUq32ihJv4Yx5mUU4SOaU4oiagOoaRH9HaxVlRP6XMyG45N6ay', 'aaaaa', 'aaaaa', '2024-05-13 13:22:55', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Answer`
--
ALTER TABLE `Answer`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `FK_Answer_User` (`user_id`),
  ADD KEY `FK_Answer_Question` (`question_id`);

--
-- Indexes for table `ArchivedQuestion`
--
ALTER TABLE `ArchivedQuestion`
  ADD PRIMARY KEY (`archived_question_id`),
  ADD KEY `fk_question_id` (`question_id`);

--
-- Indexes for table `Question`
--
ALTER TABLE `Question`
  ADD PRIMARY KEY (`question_id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `FK_Question_User` (`user_id`);

--
-- Indexes for table `QuestionOption`
--
ALTER TABLE `QuestionOption`
  ADD PRIMARY KEY (`question_option_id`),
  ADD KEY `FK_QuestionOption_Question` (`question_id`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Answer`
--
ALTER TABLE `Answer`
  MODIFY `answer_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `ArchivedQuestion`
--
ALTER TABLE `ArchivedQuestion`
  MODIFY `archived_question_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Question`
--
ALTER TABLE `Question`
  MODIFY `question_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=212;

--
-- AUTO_INCREMENT for table `QuestionOption`
--
ALTER TABLE `QuestionOption`
  MODIFY `question_option_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=249;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Answer`
--
ALTER TABLE `Answer`
  ADD CONSTRAINT `FK_Answer_Question` FOREIGN KEY (`question_id`) REFERENCES `Question` (`question_id`),
  ADD CONSTRAINT `FK_Answer_User` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

--
-- Constraints for table `ArchivedQuestion`
--
ALTER TABLE `ArchivedQuestion`
  ADD CONSTRAINT `fk_question_id` FOREIGN KEY (`question_id`) REFERENCES `Question` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `QuestionOption`
--
ALTER TABLE `QuestionOption`
  ADD CONSTRAINT `FK_QuestionOption_Question` FOREIGN KEY (`question_id`) REFERENCES `Question` (`question_id`);

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

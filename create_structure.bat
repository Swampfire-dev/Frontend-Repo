@echo off
echo Creating folder structure...

REM === FOLDERS ===
mkdir src\api
mkdir src\assets
mkdir src\assets\images
mkdir src\assets\icons
mkdir src\assets\styles

mkdir src\components
mkdir src\components\Navbar
mkdir src\components\Sidebar
mkdir src\components\Loader
mkdir src\components\Table

mkdir src\config

mkdir src\context

mkdir src\hooks

mkdir src\layouts

mkdir src\pages
mkdir src\pages\Login
mkdir src\pages\Dashboard
mkdir src\pages\Partner
mkdir src\pages\Training
mkdir src\pages\Certification

mkdir src\routes

mkdir src\services

mkdir src\store

mkdir src\utils

REM === FILES ===
REM config
echo // API URLS > src\config\apiUrls.js
echo // App configuration > src\config\appConfig.js

REM api
echo // Axios instance file > src\api\axiosInstance.js
echo // Auth API > src\api\authApi.js
echo // Partner API > src\api\partnerApi.js
echo // Training API > src\api\trainingApi.js

REM pages
echo // Login page > src\pages\Login\Login.jsx
echo // Dashboard page > src\pages\Dashboard\Dashboard.jsx
echo // Partner list > src\pages\Partner\PartnerList.jsx
echo // Partner details > src\pages\Partner\PartnerDetails.jsx
echo // Training list > src\pages\Training\TrainingList.jsx
echo // Certification list > src\pages\Certification\CertificationList.jsx

REM components
echo // Navbar > src\components\Navbar\Navbar.jsx
echo // Sidebar > src\components\Sidebar\Sidebar.jsx
echo // Loader > src\components\Loader\Loader.jsx
echo // Table component > src\components\Table\Table.jsx

REM layouts
echo // Main layout > src\layouts\MainLayout.jsx
echo // Auth layout > src\layouts\AuthLayout.jsx

REM routes
echo // App routes > src\routes\AppRoutes.jsx
echo // Protected route > src\routes\ProtectedRoute.jsx

REM store
echo // User store > src\store\userStore.js
echo // UI store > src\store\uiStore.js

REM services
echo // Auth service > src\services\authService.js
echo // Partner service > src\services\partnerService.js

REM utils
echo // Cookie util > src\utils\cookie.js
echo // Validators > src\utils\validators.js
echo // Date formatter > src\utils\formatDate.js

echo.
echo ********************************************
echo * Folder structure created successfully!   *
echo ********************************************
pause

/**
 * Tiện ích điều hướng và kiểm tra phân quyền phân giải tuyến đường an toàn (Route Guard Utilities)
 */

/**
 * Trả về route mặc định theo từng Role của người dùng.
 * - ADMIN & RECRUITER -> Khu vực làm việc '/admin'
 * - JOB_SEEKER & Khách -> Cổng thông tin việc làm '/'
 */
export function getDefaultPathForRole(role) {
  if (role === 'ADMIN' || role === 'RECRUITER') {
    return '/admin';
  }
  return '/';
}

/**
 * Kiểm tra xem một pathname có được phép truy cập bởi role tương ứng hay không.
 * Ngăn chặn việc redirect người dùng vào các trang bị cấm gây lỗi 403 Forbidden.
 * 
 * @param {string} pathname
 * @param {string} role
 * @returns {boolean}
 */
export function isPathAllowedForRole(pathname, role) {
  if (!pathname || typeof pathname !== 'string') return false;

  // Loại bỏ query params hoặc trailing slash để kiểm tra route chuẩn
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/';

  // Tuyệt đối không bao giờ redirect ngược về các trang auth hoặc error
  if (
    cleanPath === '/login' ||
    cleanPath === '/register' ||
    cleanPath === '/unauthorized' ||
    cleanPath === '/404'
  ) {
    return false;
  }

  // Tuyến đường Admin (/admin/*)
  if (cleanPath.startsWith('/admin')) {
    // Ứng viên (JOB_SEEKER) không có quyền vào bất kỳ trang /admin nào
    if (role === 'JOB_SEEKER') {
      return false;
    }

    // Tuyến đường chỉ dành riêng cho ADMIN hệ thống
    const adminOnlyRoutes = [
      '/admin/users',
      '/admin/companies',
      '/admin/categories',
      '/admin/reviews',
    ];
    if (role === 'RECRUITER' && adminOnlyRoutes.some((route) => cleanPath.startsWith(route))) {
      return false;
    }

    return role === 'ADMIN' || role === 'RECRUITER';
  }

  // Tuyến đường yêu cầu Role JOB_SEEKER (/profile, /my-applications, /my-offers)
  const seekerOnlyRoutes = ['/profile', '/my-applications', '/my-offers'];
  if (seekerOnlyRoutes.some((route) => cleanPath.startsWith(route))) {
    return role === 'JOB_SEEKER';
  }

  // Tất cả các trang public khác (/, /jobs/:id, ...) cho phép tất cả mọi người
  return true;
}

/**
 * Phân giải đường dẫn an toàn sau khi đăng nhập:
 * Nếu from location hợp lệ với quyền của người dùng -> dùng from location.
 * Nếu không hợp lệ hoặc thiếu -> fallback về trang mặc định theo role.
 * 
 * @param {string} role - Role của tài khoản vừa đăng nhập (JOB_SEEKER, RECRUITER, ADMIN)
 * @param {string|object} from - State location từ React Router
 * @returns {string} - Tuyến đường hợp lệ an toàn
 */
export function resolveRedirectPath(role, from) {
  const fromPath = typeof from === 'string' ? from : from?.pathname;
  if (fromPath && isPathAllowedForRole(fromPath, role)) {
    return fromPath;
  }
  return getDefaultPathForRole(role);
}

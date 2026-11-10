export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export const getErrorMessage = (errorJson: string): string => {
  try {
    const err = JSON.parse(errorJson);
    const code = err.error || '';
    
    if (code.includes('permission-denied')) {
      return '접근 권한이 없습니다. 관리자에게 문의하세요.';
    }
    if (code.includes('unauthenticated')) {
      return '로그인이 필요합니다. 다시 로그인해주세요.';
    }
    if (code.includes('not-found')) {
      return '요청한 데이터를 찾을 수 없습니다.';
    }
    if (code.includes('unavailable')) {
      return '현재 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
    }
    if (code.includes('resource-exhausted')) {
      return '서비스 이용 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
    }
    return '요청 처리 중 오류가 발생했습니다.';
  } catch {
    return '알 수 없는 오류가 발생했습니다.';
  }
};

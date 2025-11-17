// 언어팩
const i18n  = {
    // 서버
    'server.add.success': {
        en: 'Server added: {0}',
        ko: '서버 추가됨: {0}',
    },
    'server.edit.success': {
        en: 'Server edited: {0}',
        ko: '서버 수정됨: {0}',
    },
    'server.delete.confirm': {
        en: "Delete server '{0}'?",
        ko: "서버 '{0}'를 삭제할까요?",
    },
    'server.delete.success': {
        en: 'Server deleted: {0}',
        ko: '서버 삭제됨: {0}',
    },
    'server.connect.connecting': {
        en: 'Connecting to server: {0}...',
        ko: '서버에 연결 중: {0}...',
    },
    'server.connect.success': {
        en: 'Connected to server: {0}',
        ko: '서버 연결 성공: {0}',
    },
    'server.connect.fail': {
        en: 'Failed to connect: {0}',
        ko: '서버 연결 실패: {0}',
    },
    'server.disconnect.success': {
        en: 'Disconnected from server: {0}',
        ko: '서버 연결종료 성공: {0}',
    },
    'server.disconnect.fail': {
        en: 'Failed to disconnect: {0}',
        ko: '서버 연결종료 실패: {0}',
    },
    'server.select.edit': {
        en: 'No server selected to edit.',
        ko: '수정할 서버가 선택되지 않았습니다.',
    },
    'server.add.title': {
        en: 'ZenFTP Add Server',
        ko: 'ZenFTP 서버 추가',
    },
    'server.edit.title': {
        en: 'ZenFTP Modify Server - {0}',
        ko: 'ZenFTP 서버 수정 - {0}',
    },

    // 파일
    'file.create.newName': {
        en: 'Enter new file name',
        ko: '새 파일 이름을 입력하세요',
    },
    'file.create.success': {
        en: 'File created: {0}',
        ko: '파일 생성 완료: {0}',
    },
    'file.create.fail': {
        en: 'File creation failed: {0}',
        ko: '파일 생성 실패: {0}',
    },
    'file.open.success': {
        en: 'File opened: {0}',
        ko: '파일 열림: {0}',
    },
    'file.open.fail': {
        en: 'Failed to open file: {0}',
        ko: '파일 열기 실패: {0}',
    },
    'file.save.success': {
        en: 'File saved: {0}',
        ko: '파일 저장 완료: {0}',
    },
    'file.save.fail': {
        en: 'File save failed: {0}',
        ko: '파일 저장 실패: {0}',
    },
    'file.upload.success': {
        en: 'Upload completed: {0}',
        ko: '파일 업로드 완료: {0}',
    },
    'file.exists': {
        en: 'File already exists: {0}',
        ko: '이미 존재하는 파일입니다: {0}',
    },
    'file.delete.confirm': {
        en: "Delete file '{0}'?",
        ko: "'{0}' 파일을 삭제할까요?",
    },
    'file.delete.success': {
        en: 'Deleted: {0}',
        ko: '삭제 완료: {0}',
    },
    'file.delete.fail': {
        en: 'Delete failed: {0}',
        ko: '삭제 실패: {0}',
    },
    'file.rename.newName': {
        en: 'Change file name',
        ko: '변경 할 파일 이름을 입력하세요',
    },
    'file.rename.success': {
        en: 'Renamed to: {0}',
        ko: '이름 변경 완료: {0}',
    },
    'file.rename.fail': {
        en: 'Rename failed: {0}',
        ko: '이름 변경 실패: {0}',
    },

    // 폴더 삭제 관련
    'folder.create.newName': {
        en: 'Enter new folder name',
        ko: '새 폴더 이름을 입력하세요',
    },
    'folder.create.success': {
        en: 'Folder created: {0}',
        ko: '폴더 생성 완료: {0}',
    },
    'folder.create.fail': {
        en: 'Folder creation failed: {0}',
        ko: '폴더 생성 실패: {0}',
    },
    'folder.upload.success': {
        en: 'Folder uploaded: {0}',
        ko: '폴더 업로드 완료: {0}',
    },
    'folder.exists': {
        en: 'Folder already exists: {0}',
        ko: '이미 존재하는 폴더입니다: {0}',
    },
    'folder.delete.confirm': {
        en: "Delete folder '{0}'?",
        ko: "'{0}' 폴더를 삭제할까요?",
    },
    'folder.delete.success': {
        en: 'Folder deleted: {0}',
        ko: '폴더 삭제 완료: {0}',
    },
    'folder.delete.fail': {
        en: 'Folder delete failed: {0}',
        ko: '폴더 삭제 실패: {0}',
    },
    'folder.rename.newName': {
        en: 'Change folder name',
        ko: '변경 할 폴더 이름을 입력하세요',
    },
    'folder.rename.success': {
        en: 'Renamed to: {0}',
        ko: '이름 변경 완료: {0}',
    },
    'folder.rename.fail': {
        en: 'Rename failed: {0}',
        ko: '이름 변경 실패: {0}',
    },

    // 기타/공통
    'common.list.success': {
        en: 'File or Folder listed: {0}',
        ko: '파일/폴더 목록 불러옴: {0}',
    },
    'common.list.fail': {
        en: 'Failed to list file or folder: {0}',
        ko: '파일/폴더 목록 불러오기 실패: {0}',
    },
    'common.select.rename': {
        en: 'No file selected to rename.',
        ko: '이름을 변경할 파일/폴더가 선택되지 않았습니다.',
    },
    'common.select.delete': {
        en: 'No file selected to delete.',
        ko: '삭제할 파일/폴더가 선택되지 않았습니다.',
    },
    'common.upload.fail': {
        en: 'Upload failed: {0}',
        ko: '업로드 실패: {0}',
    },
    'common.readonly': {
        en: 'Read-only mode. Operation not allowed.',
        ko: '읽기전용 모드입니다. 작업이 허용되지 않습니다.',
    },
    'common.btn.delete': {
        en: 'Delete',
        ko: '삭제',
    },
    'common.server.group.default.name': {
        en: 'Default',
        ko: '기본',
    },
}

module.exports = i18n

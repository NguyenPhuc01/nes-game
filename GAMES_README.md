# Hướng dẫn thêm NES Games vào dự án

## ⚠️ Lưu ý về bản quyền

Việc tải và sử dụng ROM game có thể vi phạm bản quyền nếu bạn không sở hữu bản gốc của game. Chỉ sử dụng ROM của các game mà bạn đã sở hữu hợp pháp.

## Cách thêm game vào dự án

### Bước 1: Copy file ROM vào thư mục games

1. Copy file `.nes` của bạn vào thư mục:
   ```
   my-app/public/games/
   ```

2. Ví dụ: Nếu bạn có file `SuperMarioBros3.nes`, copy vào:
   ```
   my-app/public/games/SuperMarioBros3.nes
   ```

### Bước 2: Thêm game vào danh sách

Mở file `src/types/game.ts` và thêm game mới vào mảng `games`:

```typescript
{
  name: 'Tên Game',
  description: 'Mô tả game',
  filePath: '/games/TênFile.nes', // Đường dẫn đến file trong public/games/
}
```

### Ví dụ:

Nếu bạn thêm file `SuperMarioBros3.nes` vào `public/games/`, thì thêm vào `game.ts`:

```typescript
{
  name: 'Super Mario Bros 3',
  description: 'Classic platformer sequel',
  filePath: '/games/SuperMarioBros3.nes',
}
```

### Bước 3: Không có filePath (chọn file thủ công)

Nếu bạn không có file trong thư mục `games/`, bạn có thể bỏ qua `filePath`. Khi click vào game, ứng dụng sẽ mở file picker để bạn chọn file ROM:

```typescript
{
  name: 'The Legend of Zelda',
  description: 'Epic adventure',
  // Không có filePath - sẽ mở file picker khi click
}
```

## Cấu trúc thư mục

```
my-app/
├── public/
│   └── games/          ← Đặt file .nes ở đây
│       ├── 021-Contra.nes
│       ├── Mario.nes
│       └── [file game của bạn].nes
└── src/
    └── types/
        └── game.ts     ← Thêm thông tin game ở đây
```

## Lưu ý

- File ROM phải có định dạng `.nes`
- Tên file nên không có khoảng trắng (dùng dấu gạch dưới `_` hoặc gạch ngang `-`)
- Đường dẫn trong `filePath` phải bắt đầu bằng `/games/` (tương đương với `public/games/`)


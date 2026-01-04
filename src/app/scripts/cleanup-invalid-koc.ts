export function cleanupInvalidKocs(rows: any[]) {
  return rows.filter(row => {
    const channelName = row['channelName'];
    const products = row['products'];
    const labels = row['labels'];

    // điều kiện hợp lệ
    return (
      typeof channelName === 'string' &&
      channelName.trim() !== '' &&
      Array.isArray(products) &&
      products.length > 0 &&
      Array.isArray(labels)
    );
  });
}

export const downloadUrl = async (url: string, filename = "result") => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export const pickOriginalUrls = (images: any[]) => {
  return images
    .map((img) => img?.original?.secure_url || img?.secure_url)
    .filter(Boolean) as string[];
};

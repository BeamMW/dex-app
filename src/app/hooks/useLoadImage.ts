interface Resource<Payload> {
    read: () => Payload;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cache = new Map<string, any>();
  
  function createResource<Payload>(asyncFn: () => Promise<Payload>): Resource<Payload | Error> {
    let status: string;
    let result: Payload;
    let error: Error;
  
    const promise = asyncFn().then(
      (r: Payload) => {
        status = "success";
        result = r;
      },
      (e: Error) => {
        status = "error";
        error = e;
      },
    );
  
    return {
      read(): Payload {
        switch (status) {
          case "error":
            throw error;
          case "success":
            return result;
          default:
            throw promise;
        }
      },
    };
  }
  
  export default function loadImage(source: string): Resource<string> {
    let resource = cache.get(source);
    if (resource) return resource;
  
    resource = createResource<string>(
      () =>
        new Promise((resolve, reject) => {
          const img = new window.Image();
          img.src = source;
  
          img.onload = () => resolve(source);
          img.onerror = () => reject(new Error(`Failed to load image ${source}`));
        }),
    );
  
    cache.set(source, resource);
    return resource;
  }
  
// Guarded read: `import.meta.env` is undefined when tsx evaluates this module
// during prerender (Node), so a bare `import.meta.env.X` would throw there.
// Fallback = the REAL project (public `hdr` bucket; URL is not a secret), so the
// backdrop loads on any host even when the build env lacks VITE_SUPABASE_*.
const env = ((import.meta as unknown as { env?: Record<string, string | undefined> }).env) ?? {}
const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://qwtdppugdcguyeaumymc.supabase.co'
const HDR = `${SUPABASE_URL}/storage/v1/object/public/hdr`

const JPEG_P1_PREVIEW = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD//gAQTGF2YzYwLjMxLjEwMgD/2wBDAAgGBgcGBwgICAgICAkJCQoKCgkJCQkKCgoKCgoMDAwKCgoKCgoKDAwMDA0ODQ0NDA0ODg8PDxISEREVFRUZGR//xACRAAACAwEBAQAAAAAAAAAAAAADBAIFAQYABwEBAQEBAQEAAAAAAAAAAAAAAQACAwQFEAACAgECAwQGCAcBAAAAAAAAAQIDERIEIUEFMQYTYRWR0XHwMlGDQoGSoRSTscEz0hZSU3IRAQACAQMCBAQHAQAAAAAAAAABEQJRAxITISJBMQQUoQVS0bGR8GGBQnH/wAARCABAAIADARIAAhIAAxIA/9oADAMBAAIRAxEAPwD4nhjXgNHcuYK8Rh1GWqILhHDAGiAyWnIGiEAyqBEBDCqJEF8DiqI0QU0jvgeQGizZLSOvbMC0zZLAzKlgaaZsrgO6zLTQAwG8NmSQFgJwQGig9IVLIGkA9IZQAkAaRlU5Bog+qs+Rd+iLV8M1R6u3qxbjylRz2z7S89GziuMfzBTuYfdDvbjGU6S5yVLfIvZ9PeHhL1oqHVw+6Ha3K8tJc/4aj2lpPp0s8cL7xpdbbjzh1ty8WkqjDZcw6ZnnH8SHizO/tx5unJis58pVcK2zoqOkZfz1/jj7TXFzn3W1Hn8pbtnp7k/5/JU07Rz5HX7ToMZYfi0/uR9p0p58vqGzjr+ktWPht7L0j5qXbdGtt7I5Po3d/oW2jfDxd1GuGeOixJ48llZ92TvMxD5nvvq23htzwx5Zf8kx3ej2nsN7POOXhhwN3d2+MfkkvuOr76d8en93dxZs9vOvqUv+eiGK84/qWw0yUpJ5SWt8OOMn0OeOr5vss/idnHcnDLbynSfxcal6d/bz2d2cLiY877/12fOr9nKEpRa4rkRt752bm1Sv2O1cNTbVeuNmnklOUprhzzFp+R9V54yyjzeS3WcIkutu23w7A3+R9PabW0sqljk4zTf0dsf4I7y5dTVzhvhXpRWyOlYwL1dSjudxGM69KnLTHj2Nvhk6Uzju/wAVDNrLb7Xdt8NFt+gs/wBDdLqYaq3O50VarLiPTbH9n49Q0uphq3blMyqlAvIdKsf2R4rqYauluXKVPCs6CPRZ/EWXFdbD906248nES3V0u2U375MX1Hh4w0+hYEds3z/MFkzxho2BHN/SCyFFIVzyCyEQTYT1EMgUhF7weQKRmGlAYyMyaagLjp+7s2lkLabpUzi1KM4PTKMk+EoyXFNcsFYrPoeDhu4RnExljGUT6xLrTrt5cZuJpztZdQu/V2Suv3Ft1sm5SslOcpOT7W5SfHPPPaVjlnmctqOnEY44xER6RERDtTpueObmZmXO0pSgvP1AngosrsHtWezgRciITc4IZJJGYbq6Hy22R/8AMpL+YrkKKB70hu+W4uX1k/aJZM8YaPZH/SW85bm792z+4R1GeMNKo0hLB9R3jWHuLX9ZZ7RDUY4w2e2kBDJhFB7J4Ck0wCk0wEQ0wiQ0wEQ0wkQlkiSIS1ESRCWSJIhphIhphIhphJJphFJ48BSaRApP/9k='

export const PRACTICE_EXR: Record<string, string> = (() => {
  const map: Record<string, string> = {}
  for (const part of [1, 2, 3]) {
    const url = `${HDR}/hdr_p${part}/exr_p${part}_01.exr`
    for (let i = 1; i <= 12; i++) map[`p${part}-${i}`] = url
  }
  return map
})()

export const PRACTICE_JPEG_PREVIEW: Record<string, string> = (() => {
  const map: Record<string, string> = {}
  for (const part of [1, 2, 3])
    for (let i = 1; i <= 12; i++) map[`p${part}-${i}`] = JPEG_P1_PREVIEW
  return map
})()

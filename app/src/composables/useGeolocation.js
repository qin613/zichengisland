import { ref } from 'vue'

/**
 * 浏览器定位 composable
 * 提供当前坐标与获取定位的方法，失败时给出友好提示
 */
export function useGeolocation() {
  const coords = ref(null) // { latitude, longitude }
  const error = ref(null)
  const loading = ref(false)

  function getPosition() {
    loading.value = true
    error.value = null

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        error.value = '您的浏览器不支持定位功能'
        loading.value = false
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          coords.value = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }
          loading.value = false
          resolve(coords.value)
        },
        (err) => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              error.value = '定位授权被拒绝，将使用默认城市'
              break
            case err.POSITION_UNAVAILABLE:
              error.value = '定位信息不可用'
              break
            case err.TIMEOUT:
              error.value = '定位超时'
              break
            default:
              error.value = '定位失败'
          }
          loading.value = false
          resolve(null)
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
      )
    })
  }

  return { coords, error, loading, getPosition }
}

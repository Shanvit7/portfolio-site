if (process.env.NODE_ENV === 'development') {
  void import('react-scan').then(({ scan }) => scan({ enabled: true }))
}

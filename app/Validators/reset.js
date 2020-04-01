class reset {
  get rules () {
    return {
      token: 'required',
      password: 'required|confirmed',
    };
  }
}

module.exports = reset;

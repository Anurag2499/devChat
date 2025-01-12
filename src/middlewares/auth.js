const adminAuth = (req, res, next) => {
  //Logic to check if the requesr is authorized
  const token = 'xyz';
  const isAuthorizedAdmin = token === 'xyz';
  if (!isAuthorizedAdmin) {
    res.status(401).send('Admin not authorized to see this data');
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  //Logic to check if the requesr is authorized
  const token = 'xyz';
  const isAuthorizedAdmin = token === 'xyz';
  if (!isAuthorizedAdmin) {
    res.status(401).send('User not authorized to see this data');
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };

export default function (err, req, res, next) {
  console.error(err);
  res.status(500).json({ errorMessage: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.' });
}

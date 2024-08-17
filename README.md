### Usage

```
- name: Upload
  uses: hhtczengjing/upyun-deploy@v1
  env:
   UPYUN_SERVICE_NAME: ${{ secrets.UPYUN_SERVICE_NAME }}
   UPYUN_OPERATOR: ${{ secrets.UPYUN_OPERATOR }}
   UPYUN_PASSWORD: ${{ secrets.UPYUN_PASSWORD }}
  with:
   path: |
      version.json->/versions/
```

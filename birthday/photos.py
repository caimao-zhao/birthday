import json,base64,io,datetime
from pathlib import Path
from PIL import Image,ImageOps
rows=json.loads(Path('birthday/rows.json').read_text(encoding='utf8')); result=[]
for row in rows[1:]:
 v=[x[1] for x in row]; matches=list(Path('photos').glob(Path(v[1]).stem+'.*')); assert len(matches)==1,v[1]
 im=ImageOps.exif_transpose(Image.open(matches[0])).convert('RGB'); im.thumbnail((1400,1400)); b=io.BytesIO();im.save(b,'JPEG',quality=83,optimize=True)
 date=(datetime.datetime(1899,12,30)+datetime.timedelta(days=int(v[2]))).strftime('%Y.%m.%d')
 result.append(dict(date=date,text=v[3],src='data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()))
Path('birthday/memories.js').write_text('const memories='+json.dumps(result,ensure_ascii=False)+';',encoding='utf8')
print('Prepared',len(result),'photos')

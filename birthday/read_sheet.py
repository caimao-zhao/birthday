import zipfile,xml.etree.ElementTree as E,json
p='02时间轴照片回忆.xlsx'; ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(p) as z:
 s=[]
 if 'xl/sharedStrings.xml' in z.namelist():
  s=[''.join(x.itertext()) for x in E.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si',ns)]
 rows=[]
 for r in E.fromstring(z.read('xl/worksheets/sheet1.xml')).findall('.//m:row',ns):
  row=[]
  for c in r:
   v=c.find('m:v',ns); val=v.text if v is not None else ''.join(c.find('m:is',ns).itertext()) if c.find('m:is',ns) is not None else ''
   row.append([c.attrib['r'],s[int(val)] if c.attrib.get('t')=='s' else val])
  rows.append(row)
 print(json.dumps(rows,ensure_ascii=False,indent=2))
 open('birthday/rows.json','w',encoding='utf8').write(json.dumps(rows,ensure_ascii=False))

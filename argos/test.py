import dateutil.parser, datetime, os

# value = dateutil.parser.isoparse('2021-05-11T15:48:48.041Z')
# value1 = dateutil.parser.isoparse('2020-05-11T15:48:48.041Z')
# print(value1 > value)
# strified_value = str(value.strftime('%H:%M %p'))

# print(strified_value)

# print(os.listdir('./services/oum/buffer'))

import dateutil.parser
a = dateutil.parser.parse("2013-10-05T01:21:07Z")
b = dateutil.parser.parse("2013-10-05T03:55:16Z")
td = b - a
print(str(td.seconds//3600) + ':' + str((td.seconds//60)%60))
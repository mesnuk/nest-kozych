import {BadRequestException} from '@nestjs/common';

export const getDate = () => {
  return Date.now()
}

export const serializeSort =(
    sortData: string = '',
    defaultSort:any= null
)=>{
  if (!sortData && defaultSort){
    return defaultSort
  }

  let data: { name: string, type: 'asc' | 'desc' } = null
  try {
    data = JSON.parse(sortData)
  }catch (e) {
    throw new BadRequestException('Sort data must be json or invalid json')
  }

  if (data?.name && data?.type) {
    if (data.type === "asc") {
      return { [data.name]: 'ASC' };
    } else if (data.type === "desc") {
      return  { [data.name]: 'DESC' };
    }
  }
  if (defaultSort) {
    return defaultSort
  }else {
    return null
  }
}
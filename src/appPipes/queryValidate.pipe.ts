import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class QueryValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        if(metadata.type !== 'query') return value;

        const allowed = ['subject', 'grade', 'minPrice', 'maxPrice'];
        const keys = Object.keys(value);

        for(let key of keys){
            if(!allowed.includes(key)) throw new BadRequestException('Invalid query arguments');
            if(key === 'subject') continue;

            value[key] = Number(value[key]);
            if(isNaN(value[key])) throw new BadRequestException('Invalid query arguments types');
        }
        console.log(value);
        console.log(typeof value.subject, typeof value.grade, typeof value.minPrice, typeof value.maxPrice);
        return value;
    }
}
import { Module } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CategoriesResolver } from './categories.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import {
  Category,
  CategoryEntity
} from '@app/categories/entities/category.entity'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Category.name,
        useFactory: () => {
          const schema = CategoryEntity
          schema.plugin(require('mongoose-slug-generator'))
          return schema
        }
      }
    ])
  ],
  providers: [CategoriesResolver, CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule {}

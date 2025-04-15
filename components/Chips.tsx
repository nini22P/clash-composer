import { Button, InteractionTag, InteractionTagPrimary, InteractionTagSecondary, TagGroup } from '@fluentui/react-components'
import { AddFilled, AddRegular, bundleIcon } from '@fluentui/react-icons'
import React from 'react'

interface ChipsProps {
  label: string
  items: string[]
  onChange: (newItems: string[]) => void
}

const AddIcon = bundleIcon(AddFilled, AddRegular)

export default function Chips({
  label,
  items = [],
  onChange,
}: ChipsProps) {

  const handleItemChange = (index: number, value: string) => {
    const newItems = items.map((item, i) => (i === index ? value : item))
    onChange(newItems)
  }

  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems)
  }

  const handleAddItem = () => {
    const newItems = [...items, '']
    onChange(newItems)
  }

  return (
    <div className='flex gap-1 justify-start items-center flex-wrap'>
      <label className='w-28'>{label}</label>
      <TagGroup className='flex flex-wrap justify-start items-center'>
        {items.map((item, index) => (
          <InteractionTag value={item} key={index} className='my-1'>
            <InteractionTagPrimary
              hasSecondaryAction
              className='flex items-center gap-1'
              style={{width: '100%', height: '100%'}}
            >
              <input
                value={item}
                placeholder='请输入'
                className='border-none outline-none w-fit h-full'
                onChange={(e) => handleItemChange(index, e.target.value)}
              />
            </InteractionTagPrimary>
            <InteractionTagSecondary aria-label="remove" onClick={() => handleDeleteItem(index)} />
          </InteractionTag>
        ))}
      </TagGroup>
      <Button icon={<AddIcon />} onClick={handleAddItem} />

    </div>
  )
}
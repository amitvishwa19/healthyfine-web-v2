'use client'
import { appSeed } from '@/app/(workspace)/workspace/[orgId]/(misc)/_actions/app-seed'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'
import { useSocket } from '@/providers/SocketProvider'
import { seeder } from '@/utils/seeder'
import React from 'react'
import { toast } from 'sonner'

export default function DevPage() {
    const { sendNotification } = useSocket()

    const seedUser = () => {
        toast.loading('Seeding database, please wait', { id: 'seeding' })
        execute({ seed: true, seedData: seeder() })
    }


    const { execute } = useAction(appSeed, {
        onSuccess: (data) => {
            console.log(data)
            toast.success('Seeding completed', { id: 'seeding' })
        },
        onError: (error) => {
            console.log(error)
            toast.error('Seeding completed', { id: 'seeding' })
        }
    })




    return (
        <div>
            <div className=' min-h-screen bg-[#0E141B] h-screen  w-full flex flex-col p-4'>
                <span className='text-xl'>Development</span>
                <div className='m-10 p-10' >

                    <Button variant={'outline'} onClick={() => {
                        seedUser()
                    }}>
                        Seed User
                    </Button>
                </div>

                <div className='m-10 p-10' >

                    <Button variant={'outline'} onClick={() => {
                        sendNotification()
                    }}>
                        Send Notification
                    </Button>
                </div>


            </div>
        </div>
    )
}

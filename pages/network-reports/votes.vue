<script lang="ts" setup>
definePageMeta({
    middleware: 'auth',
});
const { data: voteStatistic } = await useApiFetch<VoteStatisticsApiResponse>('/api/network-report/vote/statistics', { lazy: true });
const statistic = computed<InfoBoxType[]>(() => {
    return [
        {
            title: 'Voted Members',
            icon: 'solar:users-group-two-rounded-outline',
            value: voteStatistic.value ? voteStatistic.value.totalVoters : 0,
            description: 'Members',
        },
        {
            title: 'Countries',
            icon: 'solar:earth-outline',
            value: voteStatistic.value ? voteStatistic.value.totalCountriesWithMembers : 0,
            description: 'With Members',
        },
        {
            title: 'Votes',
            icon: 'solar:soundwave-line-duotone',
            value: voteStatistic.value ? voteStatistic.value.totalVotes : 0,
            description: 'Members',
        },
        {
            title: 'Member in Votes',
            icon: 'solar:sort-vertical-outline',
            value: voteStatistic.value ? voteStatistic.value.totalVotedMembers : 0,
            description: 'Members',
        },
    ];
});
const selectedCountryId = ref<any>();
const formShowAllMembers = ref<boolean>(false);
const selectedMemberId = ref<any>();
const loadingMembersVotes = ref<boolean>(false);
const countryMembers = ref<Company[]>([]);
const activeMembersList = ref<Company[]>([]);
const topVotedMembers = ref<Company[]>([]);
const memberVotes = ref<VotedMember[]>([]);
const tabs = ref([
    { name: 'View By Country', id: 'country', icon: 'solar:earth-outline' },
    { name: 'View By Member', id: 'member', icon: 'solar:users-group-two-rounded-outline' },
    { name: 'Top Voted Members', id: 'top', icon: 'solar:soundwave-line-duotone' },
]);
const currentTab = ref('country');
const isOpen = ref(false);
const formLoading = ref(false);

async function changeTab(tab: string) {
    if (tab === 'member') {
        await activeMembers();
    }
    if (tab === 'top') {
        await getTopVotedMembers();
    }
    if (tab === 'country') {
        selectedCountryId.value = null;
        countryMembers.value = [];
    }
    currentTab.value = tab;
}
const resources = useResourceStore();
const getMembersByCountry = async () => {
    if (selectedCountryId.value) {
        formLoading.value = true;
        if (formShowAllMembers && isOpen) {
            formShowAllMembers.value = false;
        }
        console.log('Country ID', selectedCountryId.value);
        const { data: res, error } = await useApiFetch(`/api/network-report/vote/country/${selectedCountryId.value}`, {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as Company[],
        });
        if (res.value) {
            countryMembers.value = (res.value as Company[]).sort((a, b) => b.totalVotes - a.totalVotes);
        }
        if (error.value) {
            console.log(error.value);
        }
        formLoading.value = false;
    }
};
const activeMembers = async () => {
    const { data: res, error } = await useApiFetch('/api/network-report/vote/can-vote-members', {
        lazy: true,
        transform: (res) => (res as ApiResponse).data as Company[],
    });
    if (res.value) {
        activeMembersList.value = (res.value as Company[]).sort((a, b) => b.totalVotes - a.totalVotes);
    }
    if (error.value) {
        console.log(error.value);
    }
};
const getVotesByMemberId = async () => {
    if (selectedMemberId.value) {
        loadingMembersVotes.value = true;
        const { data: res, error } = await useApiFetch(`/api/network-report/vote/member/${selectedMemberId.value}`, {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as VotedMember[],
        });
        if (res.value) {
            memberVotes.value = res.value as VotedMember[];
        }
        if (error.value) {
            console.log(error.value);
        }
        loadingMembersVotes.value = false;
    }
};
const getTopVotedMembers = async () => {
    loadingMembersVotes.value = true;
    const { data: res, error } = await useApiFetch(`/api/network-report/vote/top`, {
        lazy: true,
        transform: (res) => (res as ApiResponse).data as Company[],
    });
    if (res.value) {
        topVotedMembers.value = res.value as Company[];
    }
    if (error.value) {
        console.log(error.value);
    }
    loadingMembersVotes.value = false;
};
watch(
    selectedCountryId,
    (newValue) => {
        if (newValue !== null) {
            getMembersByCountry();
        }
    },
    { immediate: true },
);

watch(
    selectedMemberId,
    (newValue) => {
        if (newValue !== null) {
            getVotesByMemberId();
        }
    },
    { immediate: true },
);
async function closeModal() {
    isOpen.value = false;
    selectedCountryId.value = null;
    formShowAllMembers.value = false;
    countryMembers.value = [];
    activeMembersList.value = [];
}
async function openModal() {
    formLoading.value = true;
    selectedCountryId.value = null;
    formShowAllMembers.value = false;
    countryMembers.value = [];
    activeMembersList.value = [];
    isOpen.value = true;
    formLoading.value = false;
}

async function handleModalSubmit() {
    formLoading.value = true;
    try {
        if (formShowAllMembers.value && activeMembersList.value.length > 0) {
            const values = activeMembersList.value.map((item: CompanyVoteUpdateBody) => ({
                id: item.id,
                votingActive: item.votingActive,
            }));
            await updateMembersStatus(values);
        } else if (!formShowAllMembers.value && countryMembers.value.length > 0) {
            const values = countryMembers.value.map((item: CompanyVoteUpdateBody) => ({
                id: item.id,
                votingActive: item.votingActive,
            }));
            await updateMembersStatus(values);
        }
        await closeModal();
    } catch (error) {
        console.error('Unexpected error during form submission:', error);
    } finally {
        formLoading.value = false;
    }
    return false;
}

watch(formShowAllMembers, async (newValue) => {
    if (newValue === true) {
        countryMembers.value = [];
        selectedCountryId.value = null;
        await activeMembers();
    } else {
        activeMembersList.value = [];
    }
});

async function updateMembersStatus(members: CompanyVoteUpdateBody[]) {
    const { data, error } = await useApiFetch<ApiResponse>(`/api/network-report/vote/update-members-status`, {
        lazy: true,
        method: 'POST',
        body: members,
    });
    if (data.value) {
        useToast({ title: 'Success', message: 'Vote Status has been updated successfully', type: 'success', duration: 5000 });
    }
    if (error.value) {
        useToast({ title: 'Error', message: error.value.message, type: 'error', duration: 5000 });
    }
}
</script>
<template>
    <div v-if="usePermissionCheck(['network_report_vote_list'])" class="flex flex-col gap-8">
        <div class="md:flex md:items-center md:justify-between md:gap-5">
            <div class="flex items-center gap-2">
                <Icon name="solar:chart-square-linear" class="size-5 opacity-75" />
                <div>Votes Report</div>
            </div>
            <div v-if="usePermissionCheck(['network_report_vote_update'])">
                <button :disabled="formLoading" class="btn btn-primary btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="openModal">
                    <Icon name="solar:chat-round-line-line-duotone" class="size-5 opacity-75" />
                    Member's Voting Status
                </button>
            </div>
        </div>
        <UiInfoBox :data="statistic" />
        <div>
            <ul class="grid lg:grid-cols-3 grid-cols-1 mx-auto gap-5 font-light">
                <template v-for="tab in tabs" :key="tab.id">
                    <li
                        :class="[
                            currentTab === tab.id ? 'bg-primary text-white cursor-default' : 'bg-white hover:bg-slate-900 hover:text-white cursor-pointer text-slate-600',
                            'rounded-full py-2 px-6 border w-full flex items-center place-content-center gap-3 text-sm ease-in-out duration-300',
                        ]"
                        @click="changeTab(tab.id)"
                    >
                        <Icon :name="tab.icon" class="size-5 mr-2" />
                        <span>{{ tab.name }}</span>
                    </li>
                </template>
            </ul>
            <div class="mt-5 font-light bg-white p-5 rounded-2xl border">
                <template v-if="currentTab === 'country'">
                    <FormSelectField v-model="selectedCountryId" placeholder="Please select a country..." :select-data="resources.countries" labelvalue="name" keyvalue="id" imgvalue="imageUrl" />
                    <template v-if="!isOpen">
                        <div v-if="countryMembers.length > 0" class="overflow-x-auto">
                            <table class="table table-report font-light">
                                <thead>
                                    <tr class="uppercase text-sm opacity-75">
                                        <th class="text-left">Member</th>
                                        <th class="text-center whitespace-nowrap">WSA ID</th>
                                        <th class="text-center whitespace-nowrap">Total Votes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in countryMembers" :key="row.id" class="text-sm">
                                        <td>
                                            <div class="flex items-center gap-3 min-w-64">
                                                <NuxtImg :src="row.imageUrl" class="h-10 !rounded-md w-20 object-contain p-0.5 shrink-0" />
                                                <div>
                                                    <div class="font-medium">{{ row.name }}</div>
                                                    <div class="text-xs opacity-75 mt-0.5">
                                                        <span v-if="row.state">{{ row.state }}, </span>
                                                        <span v-if="row.city" class="font-light">{{ row.city }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="text-center">{{ row.wsaId }}</td>
                                        <td class="text-center">{{ row.totalVotes }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </template>
                </template>
                <template v-if="currentTab === 'member'">
                    <FormSelectField v-model="selectedMemberId" placeholder="Please select a member..." :select-data="activeMembersList" labelvalue="name" keyvalue="id" imgvalue="imageUrl" secondlabelvalue="city" thirdlabelvalue="wsaId" />
                    <template v-if="!selectedMemberId && !loadingMembersVotes">
                        <div class="text-center p-5 text-sm opacity-75">Please select a <span class="font-semibold">Member</span> to view votes details.</div>
                    </template>
                    <template v-else-if="selectedMemberId !== null && loadingMembersVotes">
                        <div class="text-center p-5 text-sm opacity-75">Loading Votes...</div>
                    </template>
                    <template v-else>
                        <div v-if="memberVotes.length > 0">
                            <table class="table table-report font-light">
                                <thead>
                                    <tr class="uppercase text-sm opacity-75">
                                        <th class="text-left">Member</th>
                                        <th class="text-center">WSA ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in memberVotes" :key="row.id" class="text-sm">
                                        <td>
                                            <div class="flex items-center gap-3">
                                                <NuxtImg :src="row.member.imageUrl" class="h-10 !rounded-md w-20 object-contain p-0.5 shrink-0" />
                                                <div>
                                                    <div class="font-medium">{{ row.member.name }}</div>
                                                    <div class="text-xs opacity-75 mt-0.5">
                                                        <NuxtImg class="mr-1 h-3 w-5 object-cover bg-white border border-slate-100" :src="row.member.country.imageUrl" :alt="row.member.country.name" />
                                                        <span v-if="row.member.country">{{ row.member.country.name }}</span>
                                                        <span v-if="row.member.state">{{ row.member.state }}, </span>
                                                        <span v-if="row.member.city" class="font-light">{{ row.member.city }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="text-center">{{ row.member.wsaId }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else class="text-center p-5 text-sm opacity-75">This Member has not made any votes yet.</div>
                    </template>
                </template>
                <template v-if="currentTab === 'top'">
                    <div v-if="topVotedMembers.length > 0">
                        <table class="table table-report font-light">
                            <thead>
                                <tr class="uppercase text-sm opacity-75">
                                    <th class="text-left">Member</th>
                                    <th class="text-center">WSA ID</th>
                                    <th class="text-center">Total Votes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in topVotedMembers" :key="row.id" class="text-sm">
                                    <td>
                                        <div class="flex items-center gap-3">
                                            <NuxtImg :src="row.imageUrl" class="h-10 !rounded-md w-20 object-contain p-0.5 shrink-0" />
                                            <div>
                                                <div class="font-medium">{{ row.name }}</div>
                                                <div class="text-xs opacity-75 mt-0.5">
                                                    <span v-if="row.state">{{ row.state }}, </span>
                                                    <span v-if="row.city" class="font-light">{{ row.city }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-center">{{ row.wsaId }}</td>
                                    <td class="text-center">{{ row.totalVotes }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="text-center p-5 text-sm opacity-75">No Votes have been made by our Members</div>
                </template>
            </div>
        </div>
        <TheModal :open-modal="isOpen" size="5xl" @close-modal="closeModal()">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="font-medium">Update Member's Voting Status</div>
                    <Icon class="w-8 h-8 opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300" name="solar:close-square-outline" @click="closeModal" />
                </div>
            </template>
            <template #content>
                <div class="flex flex-col gap-5 justify-between">
                    <div class="flex items-center justify-between gap-5">
                        <div data-tw-merge class="flex items-center gap-5 place-content-center">
                            <input v-model="formShowAllMembers" name="toggle-show-all-members" type="checkbox" class="form-checkbox-input" />
                            <label for="toggle-show-all-members" class="form-label !mb-0">Show All Members</label>
                        </div>
                        <FormSelectField
                            id="get-members-by-country-form"
                            v-model="selectedCountryId"
                            :autofocus="false"
                            class="grow"
                            placeholder="Please select a country..."
                            :select-data="resources.countries"
                            labelvalue="name"
                            keyvalue="id"
                            imgvalue="imageUrl"
                        />
                    </div>
                    <div class="min-h-64">
                        <TransitionExpand>
                            <template v-if="!selectedCountryId && !formShowAllMembers">
                                <div class="text-center p-5 text-sm opacity-75">Please Selected a Country to show members or activate the toggle to show all active WSA Members...</div>
                            </template>
                            <template v-else>
                                <div v-if="(formLoading && formShowAllMembers) || (selectedCountryId && formLoading)">Loading...</div>
                                <div v-else>
                                    <div v-if="countryMembers.length > 0 || activeMembersList.length > 0">
                                        <table class="table table-report font-light">
                                            <thead>
                                                <tr class="uppercase text-sm opacity-75">
                                                    <th class="text-left">Member</th>
                                                    <th class="text-center">WSA ID</th>
                                                    <th class="text-center">Vote Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <template v-if="!formShowAllMembers">
                                                    <tr v-for="row in countryMembers" :key="row.id" class="text-sm">
                                                        <td>
                                                            <div class="flex items-center gap-3">
                                                                <NuxtImg :src="row.imageUrl" class="h-10 !rounded-md w-20 object-contain p-0.5 shrink-0" />
                                                                <div>
                                                                    <div class="font-medium">{{ row.name }}</div>
                                                                    <div class="text-xs opacity-75 mt-0.5 flex items-center gap-1.5">
                                                                        <NuxtImg class="h-3 w-5 object-cover bg-white border border-slate-100" :src="row.country.imageUrl" :alt="row.country.name" />
                                                                        <span v-if="row.country" class="font-medium">{{ row.country.name }},</span>
                                                                        <span v-if="row.state">{{ row.state }},</span>
                                                                        <span v-if="row.city" class="font-light">{{ row.city }}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="text-center">{{ row.wsaId }}</td>
                                                        <td class="text-center">
                                                            <div data-tw-merge class="flex items-center gap-5 place-content-center">
                                                                <input v-model="row.votingActive" name="toggle-show-all-members" type="checkbox" class="form-checkbox-input" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </template>
                                                <template v-else>
                                                    <tr v-for="row in activeMembersList" :key="row.id" class="text-sm">
                                                        <td>
                                                            <div class="flex items-center gap-3">
                                                                <NuxtImg :src="row.imageUrl" class="h-10 !rounded-md w-20 object-contain p-0.5 shrink-0" />
                                                                <div>
                                                                    <div class="font-medium">{{ row.name }}</div>
                                                                    <div class="text-xs opacity-75 mt-0.5 flex items-center gap-1.5">
                                                                        <NuxtImg class="h-3 w-5 object-cover bg-white border border-slate-100" :src="row.country.imageUrl" :alt="row.country.name" />
                                                                        <span v-if="row.country" class="font-medium">{{ row.country.name }},</span>
                                                                        <span v-if="row.state">{{ row.state }},</span>
                                                                        <span v-if="row.city" class="font-light">{{ row.city }}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="text-center">{{ row.wsaId }}</td>
                                                        <td class="text-center">
                                                            <div data-tw-merge class="flex items-center gap-5 place-content-center">
                                                                <input v-model="row.votingActive" name="toggle-show-all-members" type="checkbox" class="form-checkbox-input" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </template>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div v-else class="text-center p-5 text-sm opacity-75">No Members found in this country.</div>
                                </div>
                            </template>
                        </TransitionExpand>
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="w-full flex items-center justify-end gap-5">
                    <button :disabled="formLoading" class="btn-rounded btn-sm btn btn-danger px-4" type="button" @click="closeModal">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:close-circle-linear'" class="w-5 h-5 mr-2" />
                        <span>Close</span>
                    </button>
                    <button :disabled="formLoading" class="btn-rounded btn-sm btn btn-primary px-4" type="button" @click="handleModalSubmit()">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:check-circle-broken'" class="w-5 h-5 mr-2" />
                        <span v-html="'Update'" />
                    </button>
                </div>
            </template>
        </TheModal>
    </div>
</template>

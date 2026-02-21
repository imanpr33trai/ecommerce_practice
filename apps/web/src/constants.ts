import type { Product, Review, TeamMember } from "./types";

export const IMAGES = {
  heroChair:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCOTRe1JEtZycCS2AVpxho6AAstn64hpkRkYuPqx4M55pHSQwPKfqeWQxjb68FK140-nqljcvIQ1vBe6lWMmYaQ-Kvx25DkQtCFhG_ZXHNjrJwXI1XkR8spA40wwsdeff2oBbbwAciCC_IPQ70nCzMPU3lh2MoKBdP9aLMi0Vz86vwkqc_8VfKpsHObPASadq54_5813xbVV3QFPLlBnTNIf9CIEMs84frxJ1UMH-rgd1MAfumD1PK7gutbF8W8-pQrtyMjMM2gBuOM",
  heroChairDetail:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA5vc00WmwRge2F6SYiHO6BN-tThkOtBPNZMIEtciUlJDUnRJn121SSI7YS3njehUNKt-CJ21n_QBZH__RvaVKkmPAxFXeZg6aBrYnWZlHM847gGZ0N2Cs5JfpyHsjCWNhJtom42j2y7kx-J34ib9aI1MD15wXyV5OIds0JMTN7jBjBjlcqMWbiVopFqMHMJ15H3Kspu8mPwmQgzpJGnUEshLmbcRFxXqTWlCdQicMiln398pwf_ImCcS-P75GukNaaoAHJQPRqPteZ",
  armchairWhite:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCaGPTv425_KbPTlVZw45J0r8WWsCovXVuRaxl2EXPVdWhI23N9aKFbciBt4tpp-xcqX-6DEDSmgvOGYBfwOHPSEf-Hqz0x2xk3ViiXGdfmanFihgrUR0aFUSMIuaeJcdT15bUe6VoQJVFbE3ChLT53zWfnaig31Yk6x8p_Ms0u_Dmouczpgk3vpB8jfDxFVzbEKD3IxJWSXhOCChXc3pX2TUko6KXbUPWMpXGCbv6TNK7FaWXbayp_9Rbp14fKk-crP5tZD-tTRr1K7_nfYaU",
  armchairFloral:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBxjhDwDyVDPR6beVblymclqBFJrA8cJCRWhNzNISd5l4l-o0FHgU-5--N1v21gxKULO-aCnrZ1Co_PsLzDTio0KfiZhxeySPDQPkdEjlEEWXe5eSWEy40NeKrSBmnYB2C_g8R8RRIRQAV3GnH1vfKXn_8fx4x46YaF0H_1nIx2GTM0e_fvl2s-8KeZmjvoIzgtsdfYodYL_cWRNry4HpCBBgtaWgT2mRHxyIy12nFGy85Zs-y91QLuGB601j7BHWqK0_T-1Efn3v0R",
  team1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDgZSJtiTtfVl98kClil3W5qHU8GH3kiGBUi42x-Ot3rnX-EE8cqtzpo56VPpO_LdPWyXrnR3CjRIZ1whExX3oh2Ie_Hv2yyiArN2QkqM0Yw0fX4VwqTWzEyVG16mD6pOLTeomhS4Rgmf2tE8ZvTSUAzCe2504fMiZ4ftAFvZ22b3T-_jQiXp5Wgck5ZLWb9KAXjNFp7k92UhwcOyJfI46sV_imJTGeZsv-zycZKcEmTw9HuY8YAPOW2a8c_otsAdCBdIAU4eml9XGY",
  team2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC-QUf9FUCIYtTgZzeSLG0u6Kp-4ZQ-84k_wkO1uCBIb26YU-B5oWVsLQs-BoO5nHNb7UXhYziUp-4RyjBHmzDzc-oaryuRlHTF1UBCXxSl_UqIe4-JorMldHKO2kekkmKHz_FnofTo-RODIYssGrELbZ_sN2YHOnMSuBj_dP7ISBy0x_e5EkOWcx8x2QvsQmD-Drw2Abat1aSQVmMWHRfZkuCS9H28o2WnBsfHMEwIJfXlZx3fK43PTberdpDou0BAEY6lJmw4IvnF",
  team3:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCY5rytQVBfXz_IkKri7ncouWPppE23PABjjJ15ZMSah_eeqRd-YKvwMYBNjKMDPPq133SXWfrLXpdEdo0ciFgwntjn3pbAzta5_kH-iUjlWjEhXUgyMWQcUpbyR04ztAPK6iOhQmz8FbZwOmoIcfjbGd_gvC-yD4O3jAB6H1N1g2k0589xjpbZ6R9bysDlSR6G9NhJfaOWoiDMU6jGrc-Iu4KBJeCaKNWFcnDMgllhqByJL5QUmuTpGHN6vpCwEO_0-DeC5HmcP3Lr",
  abstractChair:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAIVptqYnQuvwpovDUvwJkCjCI0qPTV_XgTix0wgA0VCn5KkVHQ12K8-pmj1OS04cke3mPR225PwJ4ysZwg2JrbqF6WEwqQ5IZKCqDl4TK3h4h_npRDPTMPXsmSBEHuNo-CzfEvzv8sOJUMmtaZz__NXcwlklUqPCavBNny7i8XsXyScdIOTnhhlCVhKT_E1FPZ8sXDFRJJXGNGJEQJ72MszeCHyhRgphKPSmQDHRXDS-C7e_zLHIsHYz1YV-8YM7oM4hKbcHYYc4jD",
  productVelvetSofa:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDtJfQ1KM0P1drumnVMeh9gOhcyJ9YHtFhthu9BM_09XEdQeS68VFpueuHJccpOTVQmVsvy8SEXTYvBLLDmAs22pTw92faXme1kczEYcluyj6ic4F-PBfp-p_eGDx9u_d8V9y-PAh63VByy23W49P4A3_eMr6iZjvMUpSBmmFVUV1EK9-rYgn0x0hWwoiW-UOBMy6d0zOG8fHTW7d7COQy4THEw-rzLLi0_4SJn5O4FkfUEiUKrzh1ds02leKmYf0NopIbAZNCwijTW",
  productNordicChair:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBreY_UFqJmjzuQ7IWx-TND1hFmUCr2fuQjAAIuNz1NbzxekmOAC3ULbhn39CCdVqgDGSwdExynqopDjgJDDpR7bQvFNbGJOwiBtst3oFiCBe-E5ZBLV3_V9OuPsYGWxWiBumairnLS5IUjoMD7CFC5AuojUtTsCq3BgvynZ2pYyrIO4LrH8U5omrwhIsCU4tg9wAiJgUL2GIOqSIZL5IT4WBDBlJa-1qDTpKkPj3vBrOHD5eTvulHGb0CWhXvbiiZp0wkvpnyzAUaM",
  productMarbleTable:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBxNhDAqTRZY1ClVYyUvr4-kRQjTJdXk17NAkU3okYvQALgCQJJsUlk3CwOrXPbNTnGO1JDgvx4_DwvOY_WoGQccx7qE9pLDoPV7oCKKA43d1bP3YBlLrYDECoGBSG69EQcYYTshn5rNlNI6Udetngt2m3Vcf4fqVwtyM0U9F5oLlgafm20hZcWMUVlSwBnFfLkvr_6pM0eEO9ex7v9vf0ClcWj5juBkkqVnVPTyt_BMgdGLRy-ktMO6eism-QRKKVKouytJiY_H3Pg",
  arrivalLamp:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBeDEfedELcYKznZT_H-gwW77TFI53WxKkOZci2k1rnVtmrmLXoqr-2BuZW-r7BEIgssUdgYbCk1-BIYXdeLZo-JOScojASuCq-dzMfxNKl1Aow3dFfH6pu_pnXPxc2gbLdBiqpngV1wOsnAfPaqNKYIEjxQbookXxCvL_Zgpn84COaEZCbLWaTjgE78bBM4yBoVhXvVaPujrK8_yv-5mfD8g_yu_jJvRuU_DFMv23HetXHVkWguq9tG1byEHgOp8NvBqA-ljfmJvzT",
  arrivalVase:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBoGlrDiRjBqAzu68fq9xVQIddBjWCAYeqvt2tMMv2IxO__c2eYTS2GHTZHJ17Rs8JDeICyjg-eYIUDZgBm63xffOBQMqj1n4pgkLgDRXEhyMwdJ5shEPq3iTcYbkS3q7qCZJlfjhfZKcrRM8QYXxQatqWRWQCnG28vc_Tei_0XyZuouLl1BiazDn0PGA9bCVpz4FwW4PMFktROtK7d21l4mgufffw4ObsApjkFWBG0b3fgrWD-hVm0PrsyHojOu3nN2hDYDLmWLD02",
  arrivalStool:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCYAU_9RXKAvi4V9My1X_sY-QFoMr1l7hvpCL816sUFn7kJoyQ8BLFTkQBVpSPPIWdvmZW-r7BEIgssUdgYbCk1-BIYXdeLZo-JOScojASuCq-dzMfxNKl1Aow3dFfH6pu_pnXPxc2gbLdBiqpngV1wOsnAfPaqNKYIEjxQbookXxCvL_Zgpn84COaEZCbLWaTjgE78bBM4yBoVhXvVaPujrK8_yv-5mfD8g_yu_jJvRuU_DFMv23HetXHVkWguq9tG1byEHgOp8NvBqA-ljfmJvzT",
  arrivalCushion:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuABaSdECzeRecqGxx-LtyN3GT8ze7knbuZw7Pi2Cxn9of9mmTHYpX3NLtjp4Xc-9OEMUKPhrOW19Bsn5P7MRuI4P9-LrRTuTFbvLdM8ZvZlJ5WD_iqGs5lLHs7cs6IPe7I70SPfjqrp3jbCtsnOx2hKz_y7IqKH9wEEZX4oRpTry-YYR8crRl2UA6Gq9X3LY8hlsfUgCT6y3AY3__4DsEOia8dgtBm-eBmfFK7gkx1gIP_x0SJbEDYxuiRQ61zwplEstDjxiTmVN9pq",
  bestSellerLounge:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD161OIqdC7YTxHu3N_XTRW5xa-w9tnYbG-dz0r5yR87UX5hupw3nPsJ6G5kkTcyuypBvcu-LQeSLQZ_AN7k0H6wDpsejYCdJ8i58D0qcOXc-zGct6O6xG5WCskv3djw24BQNpMFfll_GnozfErh2C39cNry4HpCBBgtaWgT2mRHxyIy12nFGy85Zs-y91QLuGB601j7BHWqK0_T-1Efn3v0R",
  bestSellerDesk:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAR2Z_zCSswVOZszO0PtfpW-OdPg0drLluVjZfPRO7yutpqwFMSlMyr4EGhRjYomzU-F2tmIFn9lOglFYjm9PahlE8WkFBnbQnld_0Ab0D4FooJl6mqpNOXiRxOTiwbODO069EfAjiEZUB0vi_uT9j5p8nTXKD5c4yuD1EgQ-41okfj3i5zopnzNhruGiosnFxxB3BHkPfEunqMIIdsSqnBzsBhwotAkJs4m8tzQsTy-ikSf-Dzi-3S_rO13qgdD4S_xXLVn6VXxwGW",
  bannerDeals:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCapDOQw969-nOn1ZtroiurR2fqW7RsILFxaeGEDEYGdq6HhClk0SSkus0ytnENuQtQ4AuwO9-7w4omyWAX0ma_69SkuENVObp6bllIh2maUynV_rS22s6SRTXiPm_kgprI8ia4yMlevTynKdrJPaK2GZoTYAJJvjSY1A2VnSGa5TLXhsBnwkQ1Tmor-oRm-XSU0fc9bb7xqyetW34zk29T4kRTJ7ZUtKY3klS56dgesmGpc2Y5SLFgzjhjQjgqNiYvjE1MA2uRuvcQ",
  listingLongChair:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBN2MzuT5v_6oWQeVs1i2srqvCTCz8hUDB79bQ0JbOJq_oMQeAHEvU7lWkWDiCX_-Jgz43lcq9zKnatDMATyWnbXqfj_L2Pc-eDT0RlN4Ydp28vtxZZAUaj0ObcDj6fu_-boyufBY4TKItt0zWfnaig31Yk6x8p_Ms0u_Dmouczpgk3vpB8jfDxFVzbEKD3IxJWSXhOCChXc3pX2TUko6KXbUPWMpXGCbv6TNK7FaWXbayp_9Rbp14fKk-crP5tZD-tTRr1K7_nfYaU",
  listingFocusDuo:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCb2vCmuSWtIDEPSF2dTicdiqtX8FVuWbM648qSLG7PHVKPVUvhIARpolfTb401PM-wJmZ7Bn-L3H_3T8GzNiNymWGsRwbik4zYDzvRWNrtv98AVrX5vzJNkISTp0DcRsl5k6T5YEdsoWtR5Xf0iU2VcbEcEsJGw8xIFuVzD7KJNHqyU3d6Lf1oROVANLdjHw_dGjG9n0K2NJFcpVm4Cv_Ip1PUT83ccc7Ggp2jr59RL2yFwpmzBmeo5Gxx2Peq36v56XNWrYJyiD3j",
  listingCloudSofa:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCFTuZ9bUFhCyliBszeGmKJ3QAtTmsGFFv-gkeOlkIwSpBvDrqAoqPhaLQtx__kH33XDqWLVDh3L8ond_v9_dBz6Gp-vlF9H2P3xMEMmOSkiLshTk9T8Gx_Vn05Q-CFmw_XyAN8Jwiivxmmdibq0c5_LDxz5ZoOPFu6LPq78w949SFSMUbpvAWDOlboWGZytb0sXLXATNDAqpnznqDlsNNAngD0GRKU_rNowqFePPAVA3uBc0dPjXn96wgvaKVFBTE4RnT0rRg7Liwt",
  listingSideTable:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCTrtkjCK3xzoo-OyEBOsO9UwwzP2uQLWQXuoBujNEUHZyF8mH-Krr1Id585ZFcrxd_dVWpWCn2vYHmv93NqeLQMVeAs1M0T6rLsL8Z6wE94ZZR9PKyW5mMYIgRtUomR8CXFb9z9A-nT1e5dDpPn7hdi7RXxtRtQziauX0NVTZuYTJcBmC7GNBM25nwKhLP4UP77YVgYZz6OZZhuv-h8K5fLiwSnOuCLCTOzW8CwxEnWhWtu2AAXVbnpLA_t6Gx2FblOysLgrO5qcUF",
  detailMain:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuApBWpfrCQVuhAamlVUVZi0s3qz0fZjWCIyq9WToKDe4RfwjVI3ZoxjpJ9J8xm30GQoUjtQHNB5eZTTYpqfqz3GPTsST-LploSXnhuq-3E4lYQraV3DSqzBChjj4_9roNV7DK7mC4iCGw65oyk6R3UzJIe5M_-ghSXa6BCKitD5wazU6aUx2BTer8eLuG2HZnqAs1bxSL4eftZCGoGtF1niFjBd0qDOGJUJ9K7rJMMo0DMPvVmEn1Zsh7zLD5xEl4GfEl2zyVmaRyPp",
  detailThumb1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDMHVn0Pa_00cl5RyIr9Cj9IC7hNe1P1urIZQ7jlP5RPo1zGE9xAtRpZM_vM-zgAr6OkbXhq9ZjSU2_jwYm_gkQ-4KrrZZgEC3zxCTUTJBDwM9VX-XVYg0QRd4gUJ-_3U60uNKNdhOmVOs0eF2jzrXP_8VTNeZv-dzzfQUFUJL3ATGAMXoMH8eq3Pfe2UBFhIwRGBT79_NV1tN0nCjuWQltA6GxioBw8XUaUk02vLO0sAag2IIHApSGuAiY-MlSwSU2K4yPfFWM6AqF",
  detailThumb2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAwRwXzmPJh3E_VoC55cUCh735pX6jYtDOx-SoK-woZZ1Bro5lnmd7WA1BMiwcNo_UEodak0QXTE_on0i8FjxwnVypOddCZW0EwqdOrGKYzwcPUUu7vKIHEjY19M0M_b1CYnFiHlst-MNftqukSu8oScR4EYHMde2ndUKWANzLL171l0vXU-vnH_rpjmfD6a2OPjvQK0ipEMoTSNJZCKUnTXxFH3uK5jeQg8p0YFIrONFMt-Zsj_vHF0QWrHX71t9ON80hVAAYY3ich",
  detailThumb3:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBMqQEN7P0kXK1fQZGr1hlhm0Z1Z13LaK-G-F80eKVWagEx-NUxnUuUp25sjEf9nJaQMtfkJ_3A6-WFgoICj3RbhFjnz1kHQWatCdiweVlobIAYanJ1Xzc1LkosfasAqHle_3GzvpqbsvdlSjSB6gYC6pPP3cx4rsv5pjNCtAwPUFU2sRRe71l-tfPRso0p6XlKa1m5BkX2RWgAuKZm1NfkmkPg0Lm6e6DFJkoG5KvuJPtQMiVZeg_Ik1x9fIDv9oy2gVSmELE1X5oI",
  relatedLamp:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDhnwowma_jjBXi-E_m8SuHtTmC-S7lJrpP-VrYwqilTiiKKgP-zVxhy6iAniquv8k0RAr20FN7C-FIAL3rGJZa0e9wzCmbiuUGuub4WVN_cNBsjN_Aov6f_XeLOjCjusQfVy7wT12nXyfiP_bsMs92jupOps8lWB6byh_9sQh5vnxLM9g2jORpqfqkGviDMNATfrEXrzwffzhdL6ZlN_y0f1B-ZyTqsMW0mFn2mAYSX0Zt3uWpWXI3gUon6Uu4Nq5YPPX4aRIdQnLd",
  relatedTable:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAcaNU854I8v7QqdJtLo14p3493ixB9F1PjNdENhAPcpUukX8-zR8BJrUmeKi6pwh76P6SpLJ8nQUtmMcXzO0Fa1x_CchZwwWj_J-Hm4wcuYV5R4NMCj7uDznnaJrfragS1IyOMPPmfcPzt7VEwK38LTJkbczU5OwoYQ7w9mC3zQ7N7hHM6cwTEhrXcX6XoaLOXc7w5UqlZeIZ6CEAcODBIjBrtwO3BfhheiqrndQLgYm06LFYilumZPIld-sp1N8ENesQlF_BfMYDE",
  relatedSofa:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD7p-OqvvdV9atfncCsstjqFdhE1mMldZSQh88Q-l2UJk_Ahwo1j6woRjNF3SGNDI69lDUQAW-4xQo07qJfRmk6pwt2TItgMawLZdAC06zBpDoiKJbghGZxmi4kem4HwNk-64Q0VdXq-sbMRw4wZKhsHOe9oIa6zs--oGYz3CUKZxmcKyzBKwihvDAc5BvTEulbPM2a6Tb9W2bsp1YTaKsL5QUNfUTlHx4ov2-H7t0d_ZezjRjbW8VujuR_xQvM8_1UFFIlG4KbqIac",
  relatedVase:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCNWwnl4tvicKFQiNGu2172WK-fJ2k8RfajP0jvq6JFe4Fwg_ptfNehGYa6m7ntGRawnQLnHvRplfPAB_2L9ByA0juV7gUvK9429uTcdLwOdeMdwF-P1Be5bPYOrO6FIcfnERjn03-WLkO6jEeUa86mawxwzbvlEqSzD3-FdARsNU4iFj5khtoLebTsNFwjj6YC3Lu_KMcwb2tS9H2mrWWxpWF3SVNurv6Iw1W4L-NRQPJViPYHcRYdRm8YVlbQiZy52pwiIobAKjr_",
  cartItem1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBDAtqKac3di8uInultgFgObrjv3riqZHN1e4GNh7i2-3y8GBLx9jIed4LBiZvg7rFCJ78Jw30q3MSqE-ztKj_WbREm0wuszewVCuhLrNpox4UbSMqfQo87Wm5nDjLJsjTWg7xTH57VzoNBQE-QtmTmIyCYXFvYtZ-6gzWYf_Eq_nBoZsLXZtTKjpvjtyTkUBrH6q8_-hQzvoXOOi-UkgoK7ifxG8pHTSSRh1YxghN4_XOBs-zkaOq-9hAiHb6SGGxqE2VOp64cB2ZS",
  cartItem2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC3zlXOjkhAk9tpKbNIu2T4QEqdnM7U2rA2ho76uZGVjuFqQeQJSNid_xm5POYXLiYDrr8jmnLQ0s87IDek91TStLz5J4B9GrGG-wcydMWN3TmrEK_KqoBtZvaUAIgLivoeuHieyVPXrHFVXl59Bnf4QPmxAad5VobhmztublHgigQwErqCYdKWEc6YdQw1RSx7CWXT2YthGTZ9xPOELxi9NlsjrN3mXnqdbN7x3MO6LORSYepn0kinjLhMh0xRZ0JZwgUQlYdSpgte",
  cartItem3:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBz-J-spAqWBirFR2zBk4-5V-cKrwdBZlteafO1WB8fRatOFTCC0wJqP8egJApkM4De41EZy9J7u7Zw6n5UqCnFvUx-t-uulOiKcYLH3Fb-K_i2kcBELc7qyZi-6D3Ti8cPEK-kpugNhsieolwjvbUw-eNMZgW0mxR2TBa2EM3W1cvSy8bW2kje5pxcQ0G91IpTYw7KyKlllRnt7uZiFaaQOUp_68ijf4pq14gP1ZvXnOwK4plH6yj1vV0XSm92XnIX5lBiwXfgd7b4",
  upsellPillow:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAmg8kujOyEqJW_c1zE1gQMKqNM_V9ke5LvOkjiO-VzuwZIS6KxzfZ-IxReaIUb1j0I8yXtY8fUk1fvwkzdtBUQOHxRRZCKTXo__em5UJHk3yLQJr2nfAYOHgAN7gvZHzbIoSgXvde7Io61TBO25up9dkMqH_mABARmwMvJrrxEeA9SJVfM6c2J9pAvsrighxU2bHAcyu_muO_pk066wXHR71Fuj4i8fLoRHlYJMBtOZrYqQ4ZfiewDAUZmtOWIVFO1k7ukam2KMIoY",
  recentChair:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC2vWw2SnORzG1wvDsRK8fzc5HJ0dtXDyiLUF7VBj5M9l0F5GKRU5JaHbZLwQQQIUNQCYyPMdegQgwLZACBOo_kQMw-YB3iBfwwGk-5pCGCJ_XoUV2sPLykw77R-CMhucJ4VgE6S9yWDYSO_jYZa_2p8nVMch0wMuYJCOkztKpIlH4nuzQzGl1vILijmojwxB5Vurb7Igx4SZtn4b6GDVX5WJpRQnerlgDtPKAIu5sz5H-iyBFG1zvAeXzaZ-OrARBYqTY76FWFV_hJ",
  recentVase:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDwK0OuKeO1mxh6fDCZ3gr5dI45hhUTuGYdzpSSwz80SLO_MsTBs_apXfw6PK61AZdL4-h3IWM9rTCR6icE2kDyliUzqUb0CxpftQlOhqccIV5HNFvzareLyHZomqJnnQQevmIWImTpYWWSoscj5YCdJs1x_vDQX_AsCbT-Xvyms1ru7XwKj9ePzrZCTkJAp1-HsdAUg2U5QIlSTbgnmRHFD0BUx0LN0h9nXTuikEryFnGXGw_sUU7ccBs1ljYkZWpY2a1HcprvVXyw",
  recentTable:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAyaUBORQsLKUc19DvfKI7bkzHUYevGk9EtEOU6-_uydahTbv-nnJ9iKfiKdGCfA8lpwPqo_yGxWx3FJ4zBHCY30FHSRQkV7zegG3Zxs6kfxRs0E3KRtmzRbZUjRkk79rJ18Ec-LTm2V3ETYj-tOqffPtEVa_rqaPzGsXZSTCyg5t_TAjDaBwjqz9hD9NpLZ1MDSKgMOha6CqJQwkV1-nomS_A9H-miYX7dQhPEwDCsQylxzWlGEcl3HaM0l94ENomZjfUlj15zXXPc",
  recentReadingChair:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBgIajR6Ht1enRq2Y9vOaSEWua7BtZkqD6YSmGADzkrzle_q4blKu3aG595xyVC7NgfbLlsLvcxWyudaxlcr-rC0pM9hdGD9BcM7lSh6PIoyFa7Fc9K2mrNtV7AUYrq_CVaQMVuyii5YIxOhd1Yj1EgINYbiXVNm5ShvdF8I1kXP-ZadedfEYR1ihzxQ6b2N6up1SPHITe2RkZnVKnSg5M1JwVg0JLrN-57j5VM1x9XD3LX9-d3yJLAxzQqXu6I6lsX2iDjHTz9oaS4",
  mapBackground:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC8l-s1OXM5avhCGm0sZcUsq1uVWpoOPlYQFfw6A7jfmjwZOtcfzfGYOnqur84GFVtHTZ3QcQ5215TBQmcYcTnhzDri1OaLJfXPsecmuuQPXu5wOmWhhecFOjjjU6tdkGbrNA0zS7UytSiiYi0uewsfUHbKJZIEFTQcoKrpf5CcsjxIGl95BZxPhBTD1d3KKpADfYj3sU5I9IZDZTMt1ZOO8rlv8e8_e4taBixZTWQItmRaJJziNbYrVf9mWDjJyx-jMUuw4-zwCcQp",
  abstractDetail:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBR3FAu_BcqOoH4dMs-0Rfq1lJB9gASdLbkKZAd8JD_OyD19V_duKiq8OpYAHrRym3OOlV9rw4noGRCq1Yt5GtjiZDVb7-itZkiA1rAtrT8cl5kuaHUUcr-XmML9SEqvb9UpjhwvjG7xTfHy6jDUkb7akdIrXJH5NXNER4YNwxHGfFaV1ESVGs_kEYEDFMw2LyIR02pUk4hf_HFGcaQnceBA2bFRC78gHnNWNyF3pY9Sf72-1k4fWAYO0CtvqVr_tZY5oQ0T-AT8yIB",
  obsidianChair:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBB_4Hxn0NAp5xJPoocHKLWiYXw13_1Zpf0vYOqFlTyB-lcx8H1GRjup7A6kvpvfsPC4ew6cna2V2Ps0wj4OYF2je1jwwC4XLPkuH_ok4BiT8okZcFD8Y8bPP61wt45EZbeF2I21UgS2nA8_kFPMrUxGh6x8TzIVdYyypReRVhzvcTiDSeoVoNJ3xfI7aJv0s-Aj_DtBGAS21ErJI0t53sTY4emV26BDETajqr4rEMJxqxcp4z9k1JMFbIY_OXty-JUOsmZnBU1scbA",
  orderChair:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD6NW114wpwt6X1Jvmcp_Td7rIeE-iH5xmFeks3jmTvYecWJ8PvojQTotIo4Wl0ahv6LELA-qZHdcL3aRwchLJb-Itz6qNI-zwrCgcI-Q0tAdKrvLZT23n84_iPWaHu5NjFyOBRDrrsXJXhPr1wBz7bsG_ZkN2kiTjtu9Rb_y8LI6FA7pp3X-GSgaXphrZZIusosE8mJHvGT0QuJCe9AnIiUwREGQIcTe1g6-pb_a8yUu00Q2sK9eBBJPYKOlIoFdviKo8a0QaXH06G",
  userAvatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBl0jnhPSQcJlyK7DZIQwfnM6hpgg79z1xpYby-NBMx4dd43thhs2G-9fVwcd5yngTBothIU7mzkeql9AgAJVP-SBMTXnFMIPtQ6JAVVqB8j1top5y4E3L_SV8HLxj-s-YmiaCexe65cRaDFyho9FqlI7YOKt096QkT2bTZtvjve4fT6WFlhhZe8AKP-FV_QE6W56ViFciwpdlwkaPkbAFkYR6da5hgyPgl0W89GrxDwFA2GptSXJ980COD2VVpu68hGi-ASZDN2c-S",
  order1Item1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBTptcSk6AHwsmXXO0AYr0s8MyNRRDrNn5jVJb00WAvORaMEyyWJ1pqRO-BUphpFWjXovgnsVGQQeAj2SK5vVMD6Uzyaq5FxTftT5_BUj7zy3VTcQdgVMcBu9kPYxpVPSRUATyLKaGsJsRUVtj4zgLQAT7LXLkY-E2C1SOM3Hsc47xa7TGxfsosbBW0Ffbwj-Nq6D5yFEyps6zaeOJd6eorx9hIGuniQVDNgXy3e_9RSHv9etMPe4VD-b9POAD7iV0_0IeJXsFpwEwL",
  order1Item2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDD7j0JujIAZ5fIFKuAqLG4epF0ip8L3Ho7NCoO5gZpStb5GiarP8XSRiudfTq_1RaBUVrer0vrFSoYCXxQGoVuX0M5I3mrZ1SJJsyW7s9OS3f-2zwF0mKix3HxOOVQipNBnTC4Uf8sXnnwOSuw9J6ZX4dT6tflXoYPLNayIIXw7Nt6suGpg6z1QZxPJdSWjA6UCAcjlc4PRCYKpWM2LeHq78WTntF2YX_nI6dR4sF7UkpOQdAKEqFerDbWqHIjqhDOJpHxfH9Q3p1s",
  order2Item1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCv6v1wiSXQittjZNRJOoSrpHfn6nBLZJZJTV2NwlINVI4KgLQaQCKi6gsHUNGnGZAjApB_enxTkX6qfasZpHeSCnY4irLws9LST3hOSYPkOOpFpI5TihAJcGUYFKTuu5ma5HUo1tN-8FM2vHRR4RRZEwWtBq-IAmymOxwcuP2bfXxiNjQwEh_LA3IsCtBxx7ysXcXzMJ4Qwi6QQcQ6tf7oCwAtgfx0ZwpFEZgTwCteAaWDDbxkahdlLLS8SZSvhIuBe-dCLyRVSLm3",
  order3Item1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ2lvuyzI7czT7DoejbM2lVuPpSmNRwVY54RawpeYAdT2kpS7QP6oXnktf02kLy2QRoR910P3MPFMAzCz-wIKIvvoumnmHQgjvaCqPm7AExJAvVhXFMVjbEM-V6vQEG1baDUJ6-_nVy9pbXwKt-JYObv_6nFdRYhxVU1SKfjJt6tR05pYCBvLnnkEQDF3OCAfbZE1y1gE_6fRKsDB1TN0PyYcaW1LxRzJpI4yw3bLx5kODoN26_wfIsrrfaI5Iqd8gCBknOFrE0MHH",
  order3Item2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBRfj3PhMGtHwj8_DTZBS5i-ziOBAb2IljL7PXD6Zp3j0Dtv_-ezlDqnKvFq-iOJDwvKAB0zRfUd0SUaWy8K3inf4oqwdz9MPVJerBav9m662etB2zVVEALYK9mM2k891_pziFDkeqmK4JtF5IL3E7fodzrIQuvOiVzBrwaFYillYE2Tg5m_uwarn3M_VTnsEe_R1hGk-zrySjJORQhsmGq330oRZ4hEnVBkaeKwnRbSDKzcz2My-unDXlKFXipAkN_hpQNdcYWLg39",
  reviewUser1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBZQoBDtT0dvPLMimEdXx3qrlh2jo4pCC4xCa6S5DzvPbsgUEm_XFPhIkmHMDQBL9_KJI6p1e7pABQvFqIiomhHgo8AS4wpMKdzcU2i2TjfYoXYQdRO4OMtQSV30pWaqVD-P_UJdf5cK_3NvUOA-CIbgclmkQjGl_rSbE4s5OAhwDdr9SnQPqMxGyzxqZ7g7FPmYHyRpb8OIsddS5A6gX7cu3dg11GdNqd-jdE7cOevZkPzHPwEmGp5Qw72tBnY0ExWznhO_Mn373Zi",
  reviewUser2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDrJd_31O54g7Jg6O_2m8m9p0q1s2t3u4v5w6x7y8z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5a6b7c8d9e0f1",
  reviewImg1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBCAyH3X7UPqK56HzNMJhJGbC51-WRzekyK_WmL0YXIVwzkV2eu75OrkFld4FlttHzCyqrq-CVe9G84447_-d4RfZW8iJYwx1-_3-8KSOf6wIO4VMEOTFTcOZNVNPQnHliP9w-wj_Qw8d5eTelLPgw0eRuv31rKaZBuM_qEklWyffe9zclv1dh6EvL3OHZQ_DGMSn8ZTKkoPNaTLPMcdZe4yT94BEHeMi-vszbvEprGO_DPgYFo8EY1SASCtDS_EPYoCBWbzt6GItsb",
  reviewImg2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAjugP6ycxmXtisFKCClNAQ6-o5TA_f9q_3I8oxbd3OLiDrE0b4_AuS_WsbGwlvQuPrIpueC2ajxIpDV5pHIuUVPh_vCICAt6OxvL9uTRyEBdTg4o7NY3eUkBSAMzQBl-4IoKIXJwPcELdfBlOCiHxQz7Gw0n4JmVMmmQO6FiK3uzANtCbGlTbZfZZ-hsJakTNjOjFToj5WlC-NraRIDAIE_laZkP5KoXBFiiHwe1YHZFnTT1vRJEnFoQtHb399G4YQwUVIgkt4nEKJ",
};

// export const CATEGORIES = ["Sofa", "Chair", "Table", "Lamp", "Vase", "Decor"];

export const LISTING_PRODUCTS = [
  {
    id: 1,
    name: "Velvet Long Chair",
    price: 508,
    rating: 4.9,
    image: IMAGES.listingLongChair,
    category: "Chair",
    variant: "exclusive",
    description: "Elegant velvet long chair for maximum comfort.",
    collection: "Luxe Collection",
  },
  {
    id: 2,
    name: "Focus Duo Sofa",
    price: 1299,
    rating: 4.7,
    image: IMAGES.listingFocusDuo,
    category: "Sofa",
    description: "Modern duo sofa perfect for small spaces.",
    collection: "Modern Living",
  },
  {
    id: 3,
    name: "Cloud Sofa",
    price: 950,
    rating: 4.8,
    image: IMAGES.listingCloudSofa,
    category: "Sofa",
    description: "Soft as a cloud, this sofa redefines comfort.",
    collection: "Comfort Series",
  },
  {
    id: 4,
    name: "Minimal Side Table",
    price: 180,
    rating: 4.5,
    image: IMAGES.listingSideTable,
    category: "Table",
    description: "A minimalist side table for your essentials.",
    collection: "Essentials",
  },
];

export const CATEGORIES = ["All", "Table", "Dressers", "Sofa", "Chair", "Bed", "Lamps"];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Long Chair",
    category: "Sofa",
    price: 508,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1000",
    description: "Minimalist long chair designed for comfort and style.",
    isNew: true,
    colors: ["#D9D9D9", "#3A3A3A"],
    material: "Fabric",
  },
  {
    id: "2",
    name: "PureSpace Focus",
    category: "Chair",
    price: 299,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1000",
    description: "Sleek, minimalist design for ultimate productivity.",
    isOnSale: true,
    discount: 50,
    colors: ["#111111", "#FFFFFF"],
    material: "Leather",
  },
  {
    id: "3",
    name: "Nordic Lamp",
    category: "Lamps",
    price: 120,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1507473888900-52e1ad14db3d?auto=format&fit=crop&q=80&w=1000",
    description: "Warm light for a cozy atmosphere.",
    colors: ["#E2E8F0", "#8C7A6B"],
    material: "Metal",
  },
  {
    id: "4",
    name: "Oak Dresser",
    category: "Dressers",
    price: 850,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=1000",
    description: "Solid oak dresser with plenty of storage.",
    colors: ["#8C7A6B"],
    material: "Wood",
  },
  {
    id: "5",
    name: "Cloud Sofa",
    category: "Sofa",
    price: 1200,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000",
    description: "Like sitting on a cloud. Ultra soft fabric.",
    isNew: true,
    colors: ["#D9D9D9", "#FFFFFF"],
    material: "Fabric",
  },
  {
    id: "6",
    name: "Marble Table",
    category: "Table",
    price: 450,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=1000",
    description: "Genuine marble top with gold legs.",
    colors: ["#FFFFFF", "#111111"],
    material: "Marble",
  },
  {
    id: "7",
    name: "Velvet Lounge",
    category: "Chair",
    price: 350,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000",
    description: "Luxury velvet finish for your reading corner.",
    isNew: true,
    colors: ["#8C7A6B", "#3A3A3A"],
    material: "Fabric",
  },
  {
    id: "8",
    name: "Geometric Lamp",
    category: "Lamps",
    price: 89,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1513506003011-3b03c80165bd?auto=format&fit=crop&q=80&w=1000",
    description: "Modern geometric lines casting beautiful shadows.",
    colors: ["#111111"],
    material: "Metal",
  },
  {
    id: "9",
    name: "Minimal Bed",
    category: "Bed",
    price: 1500,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1505693416388-b0346efee749?auto=format&fit=crop&q=80&w=1000",
    description: "Low profile Japanese style bed frame.",
    isOnSale: true,
    discount: 20,
    colors: ["#8C7A6B", "#E2E8F0"],
    material: "Wood",
  },
  {
    id: "10",
    name: "Walnut Side",
    category: "Table",
    price: 180,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=1000",
    description: "Dark walnut wood side table.",
    colors: ["#3A3A3A"],
    material: "Wood",
  },
];

export const TEAM: TeamMember[] = [
  {
    id: "1",
    name: "Sarah",
    role: "Designer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "2",
    name: "Mike",
    role: "Engineer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "3",
    name: "Anna",
    role: "Manager",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
  },
];

export const REVIEWS = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Interior Designer",
    text: "Nestify has completely transformed my living room. The minimalist aesthetic is exactly what I was looking for.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: 2,
    name: "Emily Chen",
    role: "Architect",
    text: "The quality of the wood and the craftsmanship is outstanding. Highly recommended for anyone valuing durability.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: 3,
    name: "Michael Ross",
    role: "Product Manager",
    text: "Customer service was exceptional, and the delivery was faster than expected. The Cloud Sofa is a dream.",
    rating: 4.8,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
  },
];

export const PRODUCT_REVIEWS: Review[] = [
  {
    id: "r1",
    productId: "1",
    userId: "u1",
    userName: "Jessica M.",
    rating: 5,
    comment: "The texture is absolutely amazing. It feels so premium!",
    date: "2 days ago",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "r2",
    productId: "2",
    userId: "u2",
    userName: "David K.",
    rating: 4,
    comment: "Great design, but shipping took a day longer than expected.",
    date: "1 week ago",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "r3",
    productId: "1",
    userId: "u3",
    userName: "Sarah L.",
    rating: 5,
    comment: "Fits perfectly in my studio apartment. Minimal and functional.",
    date: "2 weeks ago",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
  },
];
